import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiHelpers';
import prisma from '@/lib/prisma';

export async function GET() {
  const { error } = await requireAuth('ADMIN' as any);
  if (error) return error;
  let settings = await prisma.appSettings.findFirst();
  if (!settings) settings = await prisma.appSettings.create({ data: { id: 'default' } });
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const { error } = await requireAuth('SUPER_ADMIN' as any);
  if (error) return error;
  const body = await request.json();
  const settings = await prisma.appSettings.upsert({ where: { id: 'default' }, update: body, create: { id: 'default', ...body } });
  return NextResponse.json(settings);
}