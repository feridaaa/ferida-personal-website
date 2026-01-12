import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { UnauthorizedError, ForbiddenError } from './errors';

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ),
      user: null,
      session: null,
    };
  }

  return { error: null, user: session.user, session };
}

export async function requireAdmin() {
  const { error, user, session } = await requireAuth();

  if (error) return { error, user: null, session: null };

  if (user.role !== 'admin') {
    return {
      error: NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      ),
      user: null,
      session: null,
    };
  }

  return { error: null, user, session };
}

export function throwUnauthorized(message?: string): never {
  throw new UnauthorizedError(message);
}

export function throwForbidden(message?: string): never {
  throw new ForbiddenError(message);
}
