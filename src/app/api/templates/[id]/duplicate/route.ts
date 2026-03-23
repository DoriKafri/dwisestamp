import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiHelpers';
import { TemplateService } from '@/services/TemplateService';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAuth('EDITOR' as any);
  if (error) return error;
  const template = await TemplateService.duplicate(params.id);
  return NextResponse.json(template, { status: 201 });
}