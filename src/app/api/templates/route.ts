import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiHelpers';
import { TemplateService } from '@/services/TemplateService';

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;
  const templates = await TemplateService.getAll();
  return NextResponse.json(templates);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth('EDITOR' as any);
  if (error) return error;
  const body = await request.json();
  const template = await TemplateService.create(body);
  return NextResponse.json(template, { status: 201 });
}