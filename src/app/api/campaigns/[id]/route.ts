import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiHelpers';
import { CampaignService } from '@/services/CampaignService';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAuth();
  if (error) return error;
  const campaign = await CampaignService.getById(params.id);
  if (!campaign) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(campaign);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAuth('ADMIN' as any);
  if (error) return error;
  const body = await request.json();
  const campaign = await CampaignService.update(params.id, body);
  return NextResponse.json(campaign);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAuth('SUPER_ADMIN' as any);
  if (error) return error;
  await CampaignService.delete(params.id);
  return NextResponse.json({ success: true });
}