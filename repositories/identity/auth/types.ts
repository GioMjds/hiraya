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
  role: string;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}