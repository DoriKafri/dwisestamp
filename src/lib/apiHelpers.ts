import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from './auth';
import { AdminRole } from '@prisma/client';

const ROLE_HIERARCHY: Record<AdminRole, number> = {
  VIEWER: 0,
  EDITOR: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

export async function requireAuth(minimumRole: AdminRole = 'VIEWER' as AdminRole) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), session: null };
  }

  const userRole = (session.user as any).role as AdminRole;
  if (!userRole || ROLE_HIERARCHY[userRole] < ROLE_HIERARCHY[minimumRole]) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), session: null };
  }

  return { error: null, session };
}