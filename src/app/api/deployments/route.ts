import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiHelpers';
import { DeploymentService } from '@/services/DeploymentService';

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;
  const deployments = await DeploymentService.getAll();
  return NextResponse.json(deployments);
}

export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth('ADMIN' as any);
  if (error) return error;
  const body = await request.json();
  const deployment = await DeploymentService.create({ ...body, deployedBy: (session!.user as any).adminId });
  DeploymentService.execute(deployment.id).catch(console.error);
  return NextResponse.json(deployment, { status: 201 });
}