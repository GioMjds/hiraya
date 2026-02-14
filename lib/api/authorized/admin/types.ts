export type IsoDateString = string;

export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdminAuditLog {
	id: string;
	action: string;
	entityType: string;
	entityId: string;
	userId: string | null;
	createdAt: IsoDateString;
}

export interface AdminDashboardResponse {
	skillsCount: number;
	capabilitiesCount: number;
	recentAuditLogs: AdminAuditLog[];
	researchMetrics: AdminResearchMetrics;
	timestamp: IsoDateString;
}

export interface AdminResearchMetrics {
	totalMatchResults: number;
	averageMatchScore: number;
	algorithmVersionDistribution: Array<{
		version: string;
		count: number;
	}>;
	topGapCapabilities: Array<{
		capabilityId: string;
		capabilityName: string;
		count: number;
	}>;
	reviewQueue: {
		pending: number;
		approved: number;
		rejected: number;
	};
}

export interface AdminSkill {
	id: string;
	name: string;
	description: string | null;
	createdAt: IsoDateString;
	updatedAt: IsoDateString;
}

export interface CreateAdminSkillData {
	name: string;
	description?: string;
}

export interface UpdateAdminSkillData {
	name?: string;
	description?: string;
}

export interface ArchiveAdminSkillResponse {
	message: string;
	id: string;
}

export interface AdminCapability {
	id: string;
	name: string;
	description: string | null;
	createdAt: IsoDateString;
	updatedAt: IsoDateString;
}

export interface CreateAdminCapabilityData {
	name: string;
	description?: string;
}

export interface UpdateAdminCapabilityData {
	name?: string;
	description?: string;
}

export interface ArchiveAdminCapabilityResponse {
	message: string;
	id: string;
}

export interface AdminEvidenceReview {
	id: string;
	entityType: string;
	entityId: string;
	action: string;
	status: ReviewStatus;
	requestedByUserId: string | null;
	handledByUserId?: string | null;
	reason?: string | null;
	createdAt: IsoDateString;
	updatedAt?: IsoDateString;
}

export interface RejectEvidenceData {
	reason: string;
}

export interface ReviewDecisionResponse {
	id: string;
	status: ReviewStatus;
	handledByUserId: string | null;
	reason?: string | null;
	updatedAt: IsoDateString;
}

export interface AuditLogListResponse {
	data: AdminAuditLog[];
	page: number;
	limit: number;
}

