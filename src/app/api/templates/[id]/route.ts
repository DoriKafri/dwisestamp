import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiHelpers';
import { TemplateService } from '@/services/TemplateService';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAuth();
  if (error) return error;
  const template = await TemplateService.getById(params.id);
  if (!template) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(template);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAuth('EDITOR' as any);
  if (error) return error;
  const body = await request.json();
  const template = await TemplateService.update(params.id, body);
  return NextResponse.json(template);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAuth('ADMIN' as any);
  if (error) return error;
  await TemplateService.delete(params.id);
  return NextResponse.json({ success: true });
}