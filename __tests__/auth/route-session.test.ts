const redirectMock = jest.fn((path: string) => {
  throw new Error(`REDIRECT:${path}`);
});

const cookiesMock = jest.fn();
const httpGetMock = jest.fn();

jest.mock('next/navigation', () => ({
  redirect: (path: string) => redirectMock(path),
}));

jest.mock('next/headers', () => ({
  cookies: () => cookiesMock(),
}));

jest.mock('@/configs', () => ({
  ApiError: class ApiError extends Error {
    status: number;
    details: Record<string, string[]> | null;

    constructor(
      message: string,
      status: number,
      details: Record<string, string[]> | null = null,
    ) {
      super(message);
      this.status = status;
      this.details = details;
    }
  },
  http: {
    get: (...args: unknown[]) => httpGetMock(...args),
  },
}));

import {
  enforceRoleSession,
  getOnboardingPath,
  getRoleHomePath,
  redirectAuthenticatedUserToHome,
} from '@/lib/auth/route-session';

const setSessionToken = (token?: string) => {
  cookiesMock.mockResolvedValue({
    get: (name: string) =>
      name === 'access_token' && token ? { value: token } : undefined,
  });
};

describe('route-session guards', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setSessionToken('token-123');
  });

  it('resolves role home and onboarding paths', () => {
    expect(getRoleHomePath('admin', 'u1')).toBe('/admin');
    expect(getRoleHomePath('user', 'u1')).toBe('/user/u1/dashboard');
    expect(getRoleHomePath('employer', 'u1')).toBe('/employer/u1/dashboard');
    expect(getOnboardingPath('u1')).toBe('/onboarding/u1');
  });

  it('redirects unauthenticated users to login', async () => {
    setSessionToken(undefined);
    await expect(
      enforceRoleSession({ expectedRole: 'user', routeUserId: 'u1' }),
    ).rejects.toThrow('REDIRECT:/login');
  });

  it('redirects authenticated users to onboarding when survey is incomplete', async () => {
    httpGetMock.mockResolvedValue({
      id: 'u1',
      email: 'user@hiraya.dev',
      firstName: 'U',
      lastName: 'One',
      phone: null,
      isActive: true,
      isEmailVerified: true,
      isSurveyDone: false,
      role: 'USER',
      profileImageUrl: null,
      archivedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      enforceRoleSession({ expectedRole: 'user', routeUserId: 'u1' }),
    ).rejects.toThrow('REDIRECT:/onboarding/u1');
  });

  it('redirects role mismatch to own role home', async () => {
    httpGetMock.mockResolvedValue({
      id: 'admin-1',
      email: 'admin@hiraya.dev',
      firstName: 'A',
      lastName: 'One',
      phone: null,
      isActive: true,
      isEmailVerified: true,
      isSurveyDone: true,
      role: 'ADMIN',
      profileImageUrl: null,
      archivedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      enforceRoleSession({ expectedRole: 'user', routeUserId: 'user-1' }),
    ).rejects.toThrow('REDIRECT:/admin');
  });

  it('redirects wrong route id to own role home', async () => {
    httpGetMock.mockResolvedValue({
      id: 'u77',
      email: 'user@hiraya.dev',
      firstName: 'U',
      lastName: 'SeventySeven',
      phone: null,
      isActive: true,
      isEmailVerified: true,
      isSurveyDone: true,
      role: 'USER',
      profileImageUrl: null,
      archivedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(
      enforceRoleSession({ expectedRole: 'user', routeUserId: 'u11' }),
    ).rejects.toThrow('REDIRECT:/user/u77/dashboard');
  });

  it('returns session context for valid role route', async () => {
    httpGetMock.mockResolvedValue({
      id: 'emp1',
      email: 'emp@hiraya.dev',
      firstName: 'E',
      lastName: 'One',
      phone: null,
      isActive: true,
      isEmailVerified: true,
      isSurveyDone: true,
      role: 'EMPLOYER',
      profileImageUrl: null,
      archivedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await enforceRoleSession({
      expectedRole: 'employer',
      routeUserId: 'emp1',
    });

    expect(result.role).toBe('employer');
    expect(result.homePath).toBe('/employer/emp1/dashboard');
  });

  it('redirects authenticated auth-page users to their role home', async () => {
    httpGetMock.mockResolvedValue({
      id: 'u1',
      email: 'user@hiraya.dev',
      firstName: 'U',
      lastName: 'One',
      phone: null,
      isActive: true,
      isEmailVerified: true,
      isSurveyDone: true,
      role: 'USER',
      profileImageUrl: null,
      archivedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(redirectAuthenticatedUserToHome()).rejects.toThrow(
      'REDIRECT:/user/u1/dashboard',
    );
  });
});
