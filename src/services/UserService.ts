import prisma from '@/lib/prisma';
import { listWorkspaceUsers } from '@/lib/google/workspace';
import { UserFilter, SyncResult } from '@/types/user';

export class UserService {
  static async getAll(filter?: UserFilter) {
    const where: any = {};
    if (filter?.search) {
      where.OR = [
        { email: { contains: filter.search, mode: 'insensitive' } },
        { fullName: { contains: filter.search, mode: 'insensitive' } },
      ];
    }
    if (filter?.department) where.department = filter.department;
    if (filter?.isActive !== undefined) where.isActive = filter.isActive;
    if (filter?.hasTemplate !== undefined) {
      where.assignments = filter.hasTemplate ? { some: {} } : { none: {} };
    }
    return prisma.workspaceUser.findMany({
      where,
      orderBy: { fullName: 'asc' },
      include: {
        assignments: { include: { template: { select: { id: true, name: true, type: true } } } },
      },
    });
  }

  static async getById(id: string) {
    return prisma.workspaceUser.findUnique({
      where: { id },
      include: { assignments: { include: { template: true } } },
    });
  }

  static async assignTemplate(userId: string, templateId: string) {
    return prisma.userTemplateAssignment.create({ data: { userId, templateId } });
  }

  static async removeAssignment(userId: string, templateId: string) {
    return prisma.userTemplateAssignment.deleteMany({ where: { userId, templateId } });
  }

  static async bulkAssignTemplate(userIds: string[], templateId: string) {
    return prisma.userTemplateAssignment.createMany({
      data: userIds.map((userId) => ({ userId, templateId })),
      skipDuplicates: true,
    });
  }

  static async syncFromWorkspace(): Promise<SyncResult> {
    const result: SyncResult = { added: 0, updated: 0, deactivated: 0, errors: [] };
    try {
      const seenEmails = new Set<string>();
      let pageToken: string | undefined;
      do {
        const { users, nextPageToken } = await listWorkspaceUsers(undefined, pageToken);
        for (const gUser of users) {
          seenEmails.add(gUser.primaryEmail);
          const userData = {
            googleId: gUser.id,
            email: gUser.primaryEmail,
            firstName: gUser.name?.givenName || null,
            lastName: gUser.name?.familyName || null,
            fullName: gUser.name?.fullName || null,
            department: gUser.organizations?.[0]?.department || null,
            jobTitle: gUser.organizations?.[0]?.title || null,
            phone: gUser.phones?.[0]?.value || null,
            avatarUrl: gUser.thumbnailPhotoUrl || null,
            isActive: !gUser.suspended,
            lastSyncedAt: new Date(),
          };
          const existing = await prisma.workspaceUser.findUnique({ where: { email: gUser.primaryEmail } });
          if (existing) {
            await prisma.workspaceUser.update({ where: { email: gUser.primaryEmail }, data: userData });
            result.updated++;
          } else {
            await prisma.workspaceUser.create({ data: userData });
            result.added++;
          }
        }
        pageToken = nextPageToken;
      } while (pageToken);
      const deactivated = await prisma.workspaceUser.updateMany({
        where: { email: { notIn: Array.from(seenEmails) }, isActive: true },
        data: { isActive: false },
      });
      result.deactivated = deactivated.count;
    } catch (err: any) {
      result.errors.push(`Sync failed: ${err.message}`);
    }
    return result;
  }

  static async getDepartments(): Promise<string[]> {
    const results = await prisma.workspaceUser.findMany({
      where: { department: { not: null }, isActive: true },
      distinct: ['department'],
      select: { department: true },
      orderBy: { department: 'asc' },
    });
    return results.map((r) => r.department!).filter(Boolean);
  }
}