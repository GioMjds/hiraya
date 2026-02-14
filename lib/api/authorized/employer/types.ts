export type IsoDateString = string;

export type OrganizationRole = 'owner' | 'admin' | 'member';
export type RoleStatus = 'draft' | 'published' | 'archived';
export type PostingStatus = 'draft' | 'open' | 'closed' | 'archived';

export interface EmployerOrganization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface EmployerOrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  organizationRole: OrganizationRole;
  createdAt: IsoDateString;
}

export interface EmployerRole {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status: RoleStatus;
  organizationId: string | null;
  createdByUserId: string | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
  archivedAt: IsoDateString | null;
  postingCount?: number;
  candidateCount?: number;
}

export interface EmployerRolePosting {
  id: string;
  roleId: string;
  organizationId: string;
  createdByUserId: string;
  status: PostingStatus;
  location: string | null;
  employmentType: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string | null;
  description: string | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
  publishedAt: IsoDateString | null;
  closedAt: IsoDateString | null;
}

export interface EmployerDashboardResponse {
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  metrics: {
    rolesCount: number;
    activeRolesCount: number;
    postingsCount: number;
    openPostingsCount: number;
    membersCount: number;
    candidateMatchesCount: number;
  };
  recentRoles: EmployerRole[];
  recentPostings: EmployerRolePosting[];
}

export interface EmployerOrganizationResponse {
  organization: EmployerOrganization;
  membership: EmployerOrganizationMember;
}

export interface EmployerMemberListItem extends EmployerOrganizationMember {
  user: {
    id: string;
    fullName: string;
    email: string;
    profileImageUrl: string | null;
  } | null;
}

export interface EmployerRoleDetailResponse {
  role: EmployerRole;
  postings: EmployerRolePosting[];
  matchesSummary: {
    total: number;
    topCandidates: EmployerCandidateMatch[];
  };
}

export interface EmployerPostingListItem extends EmployerRolePosting {
  role: EmployerRole | null;
}

export interface EmployerPostingDetailResponse extends EmployerRolePosting {
  role: EmployerRole | null;
}

export interface EmployerCandidateMatch {
  id: string;
  userId: string;
  roleId: string;
  score: number;
  algorithmVersion: string;
  explanationSummary: string | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface EmployerRoleCandidateMatchesResponse {
  role: EmployerRole;
  matches: Array<
    EmployerCandidateMatch & {
      user: {
        id: string;
        fullName: string;
        email: string;
        profileImageUrl: string | null;
      } | null;
    }
  >;
}

export interface EmployerRoleCandidateOverviewItem {
  role: EmployerRole;
  candidateCount: number;
  topScore: number;
}

export interface UpdateEmployerOrganizationData {
  name?: string;
  slug?: string;
  description?: string;
  website?: string;
}

export interface InviteOrganizationMemberData {
  email: string;
  organizationRole?: OrganizationRole;
}

export interface UpdateOrganizationMemberRoleData {
  organizationRole: OrganizationRole;
}

export interface CreateEmployerRoleData {
  title: string;
  slug?: string;
  description?: string;
}

export interface UpdateEmployerRoleData {
  title?: string;
  slug?: string;
  description?: string;
}

export interface CreateRolePostingData {
  roleId: string;
  location?: string;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  description?: string;
}

export interface UpdateRolePostingData {
  location?: string;
  employmentType?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  description?: string;
}
