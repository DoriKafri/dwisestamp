import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/apiHelpers';
import { UserService } from '@/services/UserService';

export async function GET(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;
  const searchParams = request.nextUrl.searchParams;
  const filter = {
    search: searchParams.get('search') || undefined,
    department: searchParams.get('department') || undefined,
    hasTemplate: searchParams.has('hasTemplate') ? searchParams.get('hasTemplate') === 'true' : undefined,
    isActive: searchParams.has('isActive') ? searchParams.get('isActive') === 'true' : undefined,
  };
  const users = await UserService.getAll(filter);
  return NextResponse.json(users);
}