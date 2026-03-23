import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiHelpers';
import { CampaignService } from '@/services/CampaignService';

export async function GET() {
  const { error } = await requireAuth();
  if (error) return error;
  const campaigns = await CampaignService.getAll();
  return NextResponse.json(campaigns);
}

export async function POST(request: NextRequest) {
  const { error } = await requireAuth('ADMIN' as any);
  if (error) return error;
  const body = await request.json();
  const campaign = await CampaignService.create(body);
  return NextResponse.json(campaign, { status: 201 });
}