import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiHelpers';
import { UserService } from '@/services/UserService';

export async function POST() {
  const { error } = await requireAuth('ADMIN' as any);
  if (error) return error;
  const result = await UserService.syncFromWorkspace();
  return NextResponse.json(result);
}