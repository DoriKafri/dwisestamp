import prisma from '@/lib/prisma';
import { CampaignFormData, CampaignWithStatus } from '@/types/campaign';

export class CampaignService {
  static async getAll(): Promise<CampaignWithStatus[]> {
    const campaigns = await prisma.campaign.findMany({ orderBy: [{ priority: 'desc' }, { startDate: 'desc' }] });
    const now = new Date();
    return campaigns.map((c) => ({
      ...c,
      status: !c.isActive ? 'inactive' as const : now < c.startDate ? 'scheduled' as const : now > c.endDate ? 'expired' as const : 'active' as const,
    }));
  }

  static async getById(id: string) { return prisma.campaign.findUnique({ where: { id } }); }

  static async create(data: CampaignFormData) {
    return prisma.campaign.create({ data: { ...data, startDate: new Date(data.startDate), endDate: new Date(data.endDate) } });
  }

  static async update(id: string, data: Partial<CampaignFormData>) {
    const updateData: any = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    return prisma.campaign.update({ where: { id }, data: updateData });
  }

  static async delete(id: string) { return prisma.campaign.delete({ where: { id } }); }
  static async activate(id: string) { return prisma.campaign.update({ where: { id }, data: { isActive: true } }); }
  static async deactivate(id: string) { return prisma.campaign.update({ where: { id }, data: { isActive: false } }); }

  static async getActiveBanner(): Promise<string | null> {
    const now = new Date();
    const campaign = await prisma.campaign.findFirst({
      where: { isActive: true, startDate: { lte: now }, endDate: { gte: now } },
      orderBy: { priority: 'desc' },
    });
    return campaign?.bannerHtml || null;
  }
}