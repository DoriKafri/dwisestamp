import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiHelpers';
import { DeploymentService } from '@/services/DeploymentService';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAuth();
  if (error) return error;
  const deployment = await DeploymentService.getById(params.id);
  if (!deployment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(deployment);
}