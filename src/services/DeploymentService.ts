import prisma from '@/lib/prisma';
import { compile, TemplateVariables } from '@/lib/templates/engine';
import { sanitizeSignatureHtml } from '@/lib/templates/sanitizer';
import { setUserSignature } from '@/lib/google/gmail';
import { DeploymentRequest, DeploymentProgress } from '@/types/deployment';
import { DeploymentStatus, DeploymentUserStatus } from '@prisma/client';

export class DeploymentService {
  static async create(request: DeploymentRequest) {
    const { templateId, userIds, deployedBy } = request;
    const template = await prisma.template.findUnique({ where: { id: templateId } });
    if (!template) throw new Error('Template not found');
    const users = await prisma.workspaceUser.findMany({ where: { id: { in: userIds }, isActive: true } });
    return prisma.deployment.create({
      data: {
        templateId, deployedBy,
        status: DeploymentStatus.PENDING,
        totalUsers: users.length,
        users: { create: users.map((u) => ({ userId: u.id, status: DeploymentUserStatus.PENDING })) },
      },
      include: { users: { include: { user: true } }, template: true },
    });
  }

  static async execute(deploymentId: string, onProgress?: (progress: DeploymentProgress) => void) {
    const deployment = await prisma.deployment.findUnique({
      where: { id: deploymentId },
      include: { template: true, users: { include: { user: true } } },
    });
    if (!deployment) throw new Error('Deployment not found');
    await prisma.deployment.update({ where: { id: deploymentId }, data: { status: DeploymentStatus.IN_PROGRESS, startedAt: new Date() } });

    let successCount = 0, failCount = 0;
    const settings = await prisma.appSettings.findFirst();
    const concurrency = settings?.deploymentConcurrency || 5;

    for (let i = 0; i < deployment.users.length; i += concurrency) {
      const batch = deployment.users.slice(i, i + concurrency);
      await Promise.allSettled(batch.map(async (du) => {
        try {
          const variables: TemplateVariables = {
            fullName: du.user.fullName || '', firstName: du.user.firstName || '',
            lastName: du.user.lastName || '', email: du.user.email,
            jobTitle: du.user.jobTitle || '', department: du.user.department || '',
            phone: du.user.phone || '', avatarUrl: du.user.avatarUrl || '',
            companyName: settings?.companyName || 'Develeap',
            companyDomain: settings?.companyDomain || 'develeap.com',
          };
          const compiled = compile(deployment.template.htmlContent, variables);
          const sanitized = sanitizeSignatureHtml(compiled);
          const result = await setUserSignature(du.user.email, sanitized);
          if (result.success) {
            successCount++;
            await prisma.deploymentUser.update({ where: { id: du.id }, data: { status: DeploymentUserStatus.SUCCESS, newSignature: sanitized, processedAt: new Date() } });
          } else {
            failCount++;
            await prisma.deploymentUser.update({ where: { id: du.id }, data: { status: DeploymentUserStatus.FAILED, errorMessage: result.error, processedAt: new Date() } });
          }
        } catch (error: any) {
          failCount++;
          await prisma.deploymentUser.update({ where: { id: du.id }, data: { status: DeploymentUserStatus.FAILED, errorMessage: error.message, processedAt: new Date() } });
        }
        onProgress?.({ deploymentId, status: DeploymentStatus.IN_PROGRESS, total: deployment.totalUsers, completed: successCount, failed: failCount, currentUser: du.user.email });
      }));
    }

    const finalStatus = failCount === 0 ? DeploymentStatus.COMPLETED : successCount === 0 ? DeploymentStatus.FAILED : DeploymentStatus.PARTIALLY_COMPLETED;
    await prisma.deployment.update({ where: { id: deploymentId }, data: { status: finalStatus, successCount, failCount, completedAt: new Date() } });
    return { status: finalStatus, successCount, failCount };
  }

  static async getAll() {
    return prisma.deployment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { template: { select: { id: true, name: true } }, admin: { select: { id: true, name: true, email: true } }, _count: { select: { users: true } } },
    });
  }

  static async getById(id: string) {
    return prisma.deployment.findUnique({
      where: { id },
      include: { template: true, admin: true, users: { include: { user: true }, orderBy: { createdAt: 'asc' } } },
    });
  }

  static async rollback(deploymentId: string, adminId: string) {
    const original = await prisma.deployment.findUnique({ where: { id: deploymentId }, include: { users: true } });
    if (!original) throw new Error('Deployment not found');
    const rollback = await DeploymentService.create({ templateId: original.templateId, userIds: original.users.map((u) => u.userId), deployedBy: adminId });
    await prisma.deployment.update({ where: { id: rollback.id }, data: { rollbackOf: deploymentId } });
    return rollback;
  }
}