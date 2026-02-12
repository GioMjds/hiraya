export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    isActive: boolean;
    isEmailVerified: boolean;
    isSurveyDone: boolean;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    isActive: boolean;
    isEmailVerified: boolean;
    isSurveyDone: boolean;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface VerifyEmailData {
  email: string;
  otp: string;
}

export interface VerifyEmailResponse {
  message: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isEmailVerified: boolean;
    isSurveyDone: boolean;
    role: string;
  };
  access_token?: string; // Backend returns this on verification
}

export interface ResendVerificationData {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
}

export interface ChangePasswordData {
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface ForgotPasswordRequestData {
  email: string;
}

export interface ForgotPasswordRequestResponse {
  message: string;
}

export interface ForgotPasswordVerifyData {
  email: string;
  otp: string;
}

export interface ForgotPasswordVerifyResponse {
  message: string;
}

export interface ForgotPasswordResetData {
  email: string;
  otp: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ForgotPasswordResetResponse {
  message: string;
}

export interface CurrentUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  isSurveyDone: boolean;
  role: string;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

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

export type EvidenceType =
  | 'PROJECT'
  | 'REPOSITORY'
  | 'CERTIFICATE'
  | 'ASSESSMENT'
  | 'EXPERIENCE';

export type YearsExperience = '0' | '1-2' | '3-5' | '6-10' | '10+';

export interface OnboardingSurveyData {
  persona: OnboardingPersona;
  goal: OnboardingGoal;
  yearsExperience: YearsExperience;
  location?: string;
  currentFocus?: string;
  targetOutcome: string;
  evidenceTypes?: EvidenceType[];
  hasOrganization?: boolean;
  organizationName?: string;
}

export interface OnboardingSurveyResponse {
  message: string;
}