import type { Route } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ApiError, http } from '@/configs';
import type { CurrentUserResponse } from '@/lib/api/identity/auth';

export type AuthorizedRole = 'user' | 'employer' | 'admin';

const LOGIN_PATH = '/login';

function normalizeRole(role: string): AuthorizedRole | null {
  const value = role.toLowerCase();
  if (value === 'user' || value === 'employer' || value === 'admin') {
    return value;
  }

  return null;
}

export function getRoleHomePath(role: AuthorizedRole, userId: string): string {
  if (role === 'admin') return '/admin';
  if (role === 'employer') return `/employer/${userId}/dashboard`;
  return `/user/${userId}/dashboard`;
}

export function getOnboardingPath(userId: string): string {
  return `/onboarding/${userId}`;
}

export async function getCurrentSessionUser(): Promise<CurrentUserResponse | null> {
  const token = (await cookies()).get('access_token')?.value;
  if (!token) return null;

  try {
    return await http.get<CurrentUserResponse>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
  } catch (error) {
    if (error instanceof ApiError) return null;
    throw error;
  }
}

export async function redirectAuthenticatedUserToHome() {
  const sessionUser = await getCurrentSessionUser();
  if (!sessionUser) return;

  const normalizedRole = normalizeRole(sessionUser.role);
  if (!normalizedRole) return;

  if (!sessionUser.isSurveyDone) {
    redirect(getOnboardingPath(sessionUser.id) as Route);
  }

  redirect(getRoleHomePath(normalizedRole, sessionUser.id) as Route);
}

export async function enforceRoleSession(options: {
  expectedRole: AuthorizedRole;
  routeUserId?: string;
}) {
  const sessionUser = await getCurrentSessionUser();
  if (!sessionUser) redirect(LOGIN_PATH);

  const normalizedRole = normalizeRole(sessionUser.role);
  if (!normalizedRole) redirect(LOGIN_PATH);

  if (!sessionUser.isSurveyDone) {
    redirect(getOnboardingPath(sessionUser.id) as Route);
  }

  const homePath = getRoleHomePath(normalizedRole, sessionUser.id);

  if (normalizedRole !== options.expectedRole) {
    redirect(homePath as Route);
  }

  if (options.routeUserId && options.routeUserId !== sessionUser.id) {
    redirect(homePath as Route);
  }

  return {
    sessionUser,
    role: normalizedRole,
    homePath,
  };
}
