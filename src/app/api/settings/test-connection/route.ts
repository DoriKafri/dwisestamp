import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiHelpers';
import { listWorkspaceUsers } from '@/lib/google/workspace';

export async function POST() {
  const { error } = await requireAuth('ADMIN' as any);
  if (error) return error;
  try {
    const { users } = await listWorkspaceUsers(undefined, undefined);
    return NextResponse.json({ success: true, message: `Connected successfully. Found ${users.length} users.` });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: `Connection failed: ${err.message}` }, { status: 400 });
  }
}