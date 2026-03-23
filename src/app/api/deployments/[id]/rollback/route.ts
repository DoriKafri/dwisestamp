import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiHelpers';
import { DeploymentService } from '@/services/DeploymentService';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error, session } = await requireAuth('ADMIN' as any);
  if (error) return error;
  const rollback = await DeploymentService.rollback(params.id, (session!.user as any).adminId);
  return NextResponse.json(rollback, { status: 201 });
}