import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiHelpers';
import { UserService } from '@/services/UserService';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAuth('EDITOR' as any);
  if (error) return error;
  const { templateId } = await request.json();
  const assignment = await UserService.assignTemplate(params.id, templateId);
  return NextResponse.json(assignment, { status: 201 });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAuth('EDITOR' as any);
  if (error) return error;
  const { templateId } = await request.json();
  await UserService.removeAssignment(params.id, templateId);
  return NextResponse.json({ success: true });
}