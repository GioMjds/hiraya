import { createEndpoint } from "@/configs";
import {
  AddUserSkillData,
  ComputeUserMatchesData,
  CreateUserEvidenceData,
  EvidenceWithRelations,
  MatchResult,
  UpdateUserEvidenceData,
  UpdateUserProfileData,
  UpdateUserSkillData,
  UserDashboardResponse,
  UserMatchDetail,
  UserMatchListItem,
  UserProfile,
  UserProfileResponse,
  UserRecommendationsResponse,
  Skill,
  UserSkill,
  UserSkillWithSkill,
} from './types';

const http = createEndpoint('user');

export const user = {
  getDashboard: async (): Promise<UserDashboardResponse> =>
    await http.get<UserDashboardResponse>('/dashboard', {
      auth: true,
      cache: 'no-store',
    }),

  getProfile: async (): Promise<UserProfileResponse> =>
    await http.get<UserProfileResponse>('/profile', {
      auth: true,
      cache: 'no-store',
    }),

  updateProfile: async (data: UpdateUserProfileData): Promise<UserProfile> =>
    await http.put<UserProfile>('/profile', data, {
      auth: true,
      cache: 'no-store',
    }),

  getUserSkills: async (): Promise<UserSkillWithSkill[]> =>
    await http.get<UserSkillWithSkill[]>('/skills', {
      auth: true,
      cache: 'no-store',
    }),

  getUserSkillOptions: async (): Promise<Skill[]> =>
    await http.get<Skill[]>('/skills/options', {
      auth: true,
      cache: 'no-store',
    }),

  addUserSkill: async (data: AddUserSkillData): Promise<UserSkill> =>
    await http.post<UserSkill>('/skills/add', data, {
      auth: true,
      cache: 'no-store',
    }),

  updateUserSkill: async (
    userSkillId: string,
    data: UpdateUserSkillData,
  ): Promise<UserSkill> =>
    await http.put<UserSkill>(`/skills/update/${userSkillId}`, data, {
      auth: true,
      cache: 'no-store',
    }),

  removeUserSkill: async (userSkillId: string): Promise<void> =>
    await http.delete<void>(`/skills/remove/${userSkillId}`, {
      auth: true,
      cache: 'no-store',
    }),

  getUserEvidence: async (): Promise<EvidenceWithRelations[]> =>
    await http.get<EvidenceWithRelations[]>('/evidence', {
      auth: true,
      cache: 'no-store',
    }),

  getUserEvidenceDetail: async (
    evidenceId: string,
  ): Promise<EvidenceWithRelations> =>
    await http.get<EvidenceWithRelations>(`/evidence/${evidenceId}`, {
      auth: true,
      cache: 'no-store',
    }),

  createUserEvidence: async (
    data: CreateUserEvidenceData,
  ): Promise<EvidenceWithRelations | null> =>
    await http.post<EvidenceWithRelations | null>('/evidence/add', data, {
      auth: true,
      cache: 'no-store',
    }),

  updateUserEvidence: async (
    evidenceId: string,
    data: UpdateUserEvidenceData,
  ): Promise<EvidenceWithRelations | null> =>
    await http.put<EvidenceWithRelations | null>(`/evidence/update/${evidenceId}`, data, {
      auth: true,
      cache: 'no-store',
    }),

  deleteUserEvidence: async (evidenceId: string): Promise<void> =>
    await http.delete<void>(`/evidence/remove/${evidenceId}`, {
      auth: true,
      cache: 'no-store',
    }),

  computeUserMatches: async (
    data: ComputeUserMatchesData,
  ): Promise<MatchResult[]> =>
    await http.post<MatchResult[]>('/compute', data, {
      auth: true,
      cache: 'no-store',
    }),

  getUserMatches: async (): Promise<UserMatchListItem[]> =>
    await http.get<UserMatchListItem[]>('/matches', {
      auth: true,
      cache: 'no-store',
    }),

  getUserMatchById: async (matchId: string): Promise<UserMatchDetail> =>
    await http.get<UserMatchDetail>(`/matches/${matchId}`, {
      auth: true,
      cache: 'no-store',
    }),

  getUserRecommendations: async (): Promise<UserRecommendationsResponse> =>
    await http.get<UserRecommendationsResponse>('/recommendations', {
      auth: true,
      cache: 'no-store',
    }),
}