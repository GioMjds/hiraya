import { createEndpoint } from '@/configs';
import type {
  CreateEmployerRoleData,
  CreateRolePostingData,
  EmployerDashboardResponse,
  EmployerMemberListItem,
  EmployerOrganizationResponse,
  EmployerOrganizationMember,
  EmployerPostingDetailResponse,
  EmployerPostingListItem,
  EmployerRolePosting,
  EmployerRole,
  EmployerRoleCandidateMatchesResponse,
  EmployerRoleCandidateOverviewItem,
  EmployerRoleDetailResponse,
  InviteOrganizationMemberData,
  UpdateEmployerOrganizationData,
  UpdateEmployerRoleData,
  UpdateOrganizationMemberRoleData,
  UpdateRolePostingData,
} from './types';

const http = createEndpoint('employer');

export const employer = {
  getDashboard: async (): Promise<EmployerDashboardResponse> =>
    await http.get<EmployerDashboardResponse>('/dashboard', {
      auth: true,
      cache: 'no-store',
    }),

  getOrganization: async (): Promise<EmployerOrganizationResponse> =>
    await http.get<EmployerOrganizationResponse>('/org', {
      auth: true,
      cache: 'no-store',
    }),

  updateOrganization: async (
    organizationId: string,
    data: UpdateEmployerOrganizationData,
  ): Promise<EmployerOrganizationResponse['organization']> =>
    await http.put<EmployerOrganizationResponse['organization']>(
      `/org/${organizationId}`,
      data,
      {
        auth: true,
        cache: 'no-store',
      },
    ),

  getOrganizationMembers: async (): Promise<EmployerMemberListItem[]> =>
    await http.get<EmployerMemberListItem[]>('/org/members', {
      auth: true,
      cache: 'no-store',
    }),

  inviteOrganizationMember: async (
    data: InviteOrganizationMemberData,
  ): Promise<EmployerMemberListItem> =>
    await http.post<EmployerMemberListItem>('/org/invite', data, {
      auth: true,
      cache: 'no-store',
    }),

  updateOrganizationMemberRole: async (
    memberId: string,
    data: UpdateOrganizationMemberRoleData,
  ): Promise<EmployerOrganizationMember> =>
    await http.put<EmployerOrganizationMember>(
      `/org/members/${memberId}/role`,
      data,
      {
        auth: true,
        cache: 'no-store',
      },
    ),

  removeOrganizationMember: async (
    memberId: string,
  ): Promise<{ id: string; message: string }> =>
    await http.delete<{ id: string; message: string }>(
      `/org/members/${memberId}/delete`,
      {
        auth: true,
        cache: 'no-store',
      },
    ),

  getRoles: async (): Promise<EmployerRole[]> =>
    await http.get<EmployerRole[]>('/roles', {
      auth: true,
      cache: 'no-store',
    }),

  getRoleById: async (roleId: string): Promise<EmployerRoleDetailResponse> =>
    await http.get<EmployerRoleDetailResponse>(`/roles/${roleId}`, {
      auth: true,
      cache: 'no-store',
    }),

  createRole: async (data: CreateEmployerRoleData): Promise<EmployerRole> =>
    await http.post<EmployerRole>('/roles', data, {
      auth: true,
      cache: 'no-store',
    }),

  updateRole: async (
    roleId: string,
    data: UpdateEmployerRoleData,
  ): Promise<EmployerRole> =>
    await http.put<EmployerRole>(`/roles/${roleId}`, data, {
      auth: true,
      cache: 'no-store',
    }),

  archiveRole: async (
    roleId: string,
  ): Promise<{ id: string; status: string; archivedAt: string | null }> =>
    await http.put<{ id: string; status: string; archivedAt: string | null }>(
      `/roles/${roleId}/archive`,
      {},
      {
        auth: true,
        cache: 'no-store',
      },
    ),

  getRolePostings: async (): Promise<EmployerPostingListItem[]> =>
    await http.get<EmployerPostingListItem[]>('/role-posts', {
      auth: true,
      cache: 'no-store',
    }),

  getRolePostingById: async (
    postingId: string,
  ): Promise<EmployerPostingDetailResponse> =>
    await http.get<EmployerPostingDetailResponse>(`/role-posts/${postingId}`, {
      auth: true,
      cache: 'no-store',
    }),

  createRolePosting: async (
    data: CreateRolePostingData,
  ): Promise<EmployerRolePosting> =>
    await http.post<EmployerRolePosting>('/role-posts/create', data, {
      auth: true,
      cache: 'no-store',
    }),

  updateRolePosting: async (
    postingId: string,
    data: UpdateRolePostingData,
  ): Promise<EmployerRolePosting> =>
    await http.put<EmployerRolePosting>(
      `/role-posts/${postingId}/update`,
      data,
      {
        auth: true,
        cache: 'no-store',
      },
    ),

  publishRolePosting: async (
    postingId: string,
  ): Promise<EmployerRolePosting> =>
    await http.post<EmployerRolePosting>(
      `/role-posts/${postingId}/publish`,
      {},
      {
        auth: true,
        cache: 'no-store',
      },
    ),

  closeRolePosting: async (
    postingId: string,
  ): Promise<EmployerRolePosting> =>
    await http.put<EmployerRolePosting>(
      `/role-posts/${postingId}/close`,
      {},
      {
        auth: true,
        cache: 'no-store',
      },
    ),

  getRoleCandidateMatches: async (
    roleId?: string,
  ): Promise<
    EmployerRoleCandidateMatchesResponse | EmployerRoleCandidateOverviewItem[]
  > =>
    await http.get<
      EmployerRoleCandidateMatchesResponse | EmployerRoleCandidateOverviewItem[]
    >('/role-candidate-matches', {
      params: roleId ? { roleId } : undefined,
      auth: true,
      cache: 'no-store',
    }),
};
