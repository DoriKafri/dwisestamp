import prisma from '@/lib/prisma';
import { TemplateFormData } from '@/types/template';

export class TemplateService {
  static async getAll() {
    return prisma.template.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { assignments: true } } },
    });
  }

  static async getById(id: string) {
    return prisma.template.findUnique({
      where: { id },
      include: { assignments: { include: { user: true } } },
    });
  }

  static async create(data: TemplateFormData) {
    if (data.isDefault) {
      await prisma.template.updateMany({
        where: { type: data.type, isDefault: true },
        data: { isDefault: false },
      });
    }
    return prisma.template.create({ data });
  }

  static async update(id: string, data: Partial<TemplateFormData>) {
    if (data.isDefault) {
      const current = await prisma.template.findUnique({ where: { id } });
      if (current) {
        await prisma.template.updateMany({
          where: { type: current.type, isDefault: true, id: { not: id } },
          data: { isDefault: false },
        });
      }
    }
    return prisma.template.update({
      where: { id },
      data: { ...data, version: { increment: 1 } },
    });
  }

  static async delete(id: string) {
    return prisma.template.delete({ where: { id } });
  }

  static async duplicate(id: string) {
    const original = await prisma.template.findUnique({ where: { id } });
    if (!original) throw new Error('Template not found');
    return prisma.template.create({
      data: {
        name: `${original.name} (Copy)`,
        description: original.description,
        type: original.type,
        htmlContent: original.htmlContent,
        isDefault: false,
        isActive: original.isActive,
      },
    });
  }

  static async getDefaults() {
    return prisma.template.findMany({ where: { isDefault: true, isActive: true } });
  }
}