import { createEndpoint } from '@/configs';
import type {
  AdminCapability,
  AdminDashboardResponse,
  AdminEvidenceReview,
  AdminSkill,
  ArchiveAdminCapabilityResponse,
  ArchiveAdminSkillResponse,
  AuditLogListResponse,
  CreateAdminCapabilityData,
  CreateAdminSkillData,
  RejectEvidenceData,
  ReviewDecisionResponse,
  UpdateAdminCapabilityData,
  UpdateAdminSkillData,
} from './types';

const http = createEndpoint('admin');

export const admin = {
  getDashboard: async (): Promise<AdminDashboardResponse> =>
    await http.get<AdminDashboardResponse>('/dashboard', {
      auth: true,
      cache: 'no-store',
    }),

  getSkills: async (): Promise<AdminSkill[]> =>
    await http.get<AdminSkill[]>('/skills', {
      auth: true,
      cache: 'no-store',
    }),

  createSkill: async (data: CreateAdminSkillData): Promise<AdminSkill> =>
    await http.post<AdminSkill>('/skills/create', data, {
      auth: true,
      cache: 'no-store',
    }),

  updateSkill: async (
    id: string,
    data: UpdateAdminSkillData,
  ): Promise<AdminSkill> =>
    await http.put<AdminSkill>(`/skills/${id}/update`, data, {
      auth: true,
      cache: 'no-store',
    }),

  archiveSkill: async (id: string): Promise<ArchiveAdminSkillResponse> =>
    await http.post<ArchiveAdminSkillResponse>(
      `/skills/${id}/archive`,
      {},
      {
        auth: true,
        cache: 'no-store',
      },
    ),

  getCapabilities: async (): Promise<AdminCapability[]> =>
    await http.get<AdminCapability[]>('/capabilities', {
      auth: true,
      cache: 'no-store',
    }),

  createCapability: async (
    data: CreateAdminCapabilityData,
  ): Promise<AdminCapability> =>
    await http.post<AdminCapability>('/capabilities/create', data, {
      auth: true,
      cache: 'no-store',
    }),

  updateCapability: async (
    id: string,
    data: UpdateAdminCapabilityData,
  ): Promise<AdminCapability> =>
    await http.put<AdminCapability>(`/capabilities/${id}/update`, data, {
      auth: true,
      cache: 'no-store',
    }),

  archiveCapability: async (
    id: string,
  ): Promise<ArchiveAdminCapabilityResponse> =>
    await http.put<ArchiveAdminCapabilityResponse>(
      `/capabilities/${id}/archive`,
      {},
      {
        auth: true,
        cache: 'no-store',
      },
    ),

  getEvidenceReviewQueue: async (): Promise<AdminEvidenceReview[]> =>
    await http.get<AdminEvidenceReview[]>('/evidence-review-queue', {
      auth: true,
      cache: 'no-store',
    }),

  getEvidenceReviewById: async (id: string): Promise<AdminEvidenceReview> =>
    await http.get<AdminEvidenceReview>(`/evidence-review/${id}`, {
      auth: true,
      cache: 'no-store',
    }),

  approveEvidenceReview: async (id: string): Promise<ReviewDecisionResponse> =>
    await http.put<ReviewDecisionResponse>(
      `/evidence-review/${id}/approve`,
      {},
      {
        auth: true,
        cache: 'no-store',
      },
    ),

  rejectEvidenceReview: async (
    id: string,
    data: RejectEvidenceData,
  ): Promise<ReviewDecisionResponse> =>
    await http.put<ReviewDecisionResponse>(
      `/evidence-review/${id}/reject`,
      data,
      {
        auth: true,
        cache: 'no-store',
      },
    ),

  auditLogs: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<AuditLogListResponse> =>
    await http.get<AuditLogListResponse>('/audit-logs', {
      params,
      auth: true,
      cache: 'no-store',
    }),
};
