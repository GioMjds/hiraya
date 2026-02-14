export type IsoDateString = string;

export type ProficiencyLevel =
	| 'novice'
	| 'beginner'
	| 'intermediate'
	| 'advanced'
	| 'expert';

export type EvidenceType =
	| 'project'
	| 'repository'
	| 'certificate'
	| 'assessment'
	| 'experience';

export type OnboardingPersona =
	| 'STUDENT'
	| 'JOB_SEEKER'
	| 'PROFESSIONAL'
	| 'CAREER_SHIFTER'
	| 'EMPLOYER';

export type OnboardingGoal =
	| 'GET_MATCHES'
	| 'FIND_SKILL_GAPS'
	| 'VALIDATE_SKILLS'
	| 'EXPLORE_PATHS'
	| 'CREATE_ROLES'
	| 'VIEW_CANDIDATE_MATCHES'
	| 'MANAGE_ORGANIZATION';

export type RoleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface UserDashboardResponse {
	user: {
		id: string;
		fullName: string;
		email: string;
		profileImageUrl: string | null;
	};
	profile: UserProfile | null;
	metrics: {
		skillsCount: number;
		evidenceCount: number;
		matchesCount: number;
		topMatchScore: number;
	};
	topMatches: MatchResult[];
}

export interface UserProfile {
	id: string;
	userId: string;
	headline: string | null;
	summary: string | null;
	location: string | null;
	currentRole: string | null;
	yearsExperience: number | null;
	persona: OnboardingPersona | null;
	goal: OnboardingGoal | null;
	targetOutcome: string | null;
	evidenceTypes: EvidenceType[];
	hasOrganization: boolean | null;
	organizationName: string | null;
	createdAt: IsoDateString;
	updatedAt: IsoDateString;
}

export interface UserProfileResponse {
	user: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		phone: string | null;
		profileImageUrl: string | null;
		isSurveyDone: boolean;
	};
	profile: UserProfile | null;
}

export interface UpdateUserProfileData {
	headline?: string | null;
	summary?: string | null;
	location?: string | null;
	currentRole?: string | null;
	yearsExperience?: number | null;
	persona?: OnboardingPersona | null;
	goal?: OnboardingGoal | null;
	targetOutcome?: string | null;
	evidenceTypes?: EvidenceType[];
	hasOrganization?: boolean | null;
	organizationName?: string | null;
}

export interface Skill {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	isActive: boolean;
	createdAt: IsoDateString;
	updatedAt: IsoDateString;
	archivedAt: IsoDateString | null;
}

export interface UserSkill {
	id: string;
	userId: string;
	skillId: string;
	level: ProficiencyLevel;
	confidence: number;
	isPrimary: boolean;
	createdAt: IsoDateString;
	updatedAt: IsoDateString;
}

export interface UserSkillWithSkill extends UserSkill {
	skill: Skill | null;
}

export interface AddUserSkillData {
	skillId: string;
	level: ProficiencyLevel;
	confidence: number;
	isPrimary?: boolean;
}

export interface UpdateUserSkillData {
	level?: ProficiencyLevel;
	confidence?: number;
	isPrimary?: boolean;
}

export interface EvidenceLinkInput {
	url: string;
	label?: string | null;
	metadata?: Record<string, unknown> | null;
}

export interface Evidence {
	id: string;
	userId: string;
	type: EvidenceType;
	title: string;
	description: string | null;
	issuedBy: string | null;
	issuedAt: IsoDateString | null;
	expiresAt: IsoDateString | null;
	createdAt: IsoDateString;
	updatedAt: IsoDateString;
	deletedAt: IsoDateString | null;
}

export interface EvidenceWithRelations extends Evidence {
	links: EvidenceLink[];
	skillLinks: UserSkill[];
}

export interface EvidenceLink {
	id: string;
	evidenceId: string;
	url: string;
	label: string | null;
	metadata: Record<string, unknown> | null;
	createdAt: IsoDateString;
}

export interface CreateUserEvidenceData {
	type: EvidenceType;
	title: string;
	description?: string | null;
	issuedBy?: string | null;
	issuedAt?: string | null;
	expiresAt?: string | null;
	skillIds?: string[];
	links?: EvidenceLinkInput[];
}

export interface UpdateUserEvidenceData {
	type?: EvidenceType;
	title?: string;
	description?: string | null;
	issuedBy?: string | null;
	issuedAt?: string | null;
	expiresAt?: string | null;
	skillIds?: string[];
	links?: EvidenceLinkInput[];
}

export interface ComputeUserMatchesData {
	roleIds?: string[];
	algorithmVersion?: string;
}

export interface MatchResult {
	id: string;
	userId: string;
	roleId: string;
	score: number;
	algorithmVersion: string;
	explanationSummary: string | null;
	createdAt: IsoDateString;
	updatedAt: IsoDateString;
}

export interface Role {
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
}

export interface SkillGap {
	id: string;
	matchResultId: string;
	skillId: string | null;
	capabilityId: string | null;
	requiredLevel: ProficiencyLevel;
	currentLevel: ProficiencyLevel | null;
	gapScore: number;
	createdAt: IsoDateString;
}

export interface UserMatchListItem extends MatchResult {
	role: Role | null;
	gapCount: number;
}

export interface UserMatchDetail extends MatchResult {
	role: Role | null;
	gaps: SkillGap[];
}

export interface UserRecommendationsResponse {
	topRoleMatches: Array<{
		match: MatchResult;
		role: Role | null;
	}>;
	learningRecommendations: Array<{
		capabilityId: string | null;
		capabilityName: string | null;
		requiredLevel: ProficiencyLevel;
		currentLevel: ProficiencyLevel | null;
		gapScore: number;
		relatedUserSkills: Array<{
			userSkillId: string;
			skillId: string;
			level: ProficiencyLevel;
			confidence: number;
		}>;
	}>;
}

