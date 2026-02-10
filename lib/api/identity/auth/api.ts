import { cacheStrategies, createEndpoint } from '@/configs';
import {
  LoginData,
  LoginResponse,
  RegisterData,
  RegisterResponse,
  VerifyEmailData,
  VerifyEmailResponse,
  ResendVerificationData,
  ResendVerificationResponse,
  ChangePasswordData,
  ChangePasswordResponse,
  ForgotPasswordRequestData,
  ForgotPasswordRequestResponse,
  ForgotPasswordVerifyData,
  ForgotPasswordVerifyResponse,
  ForgotPasswordResetData,
  ForgotPasswordResetResponse,
  CurrentUserResponse,
} from './types';

const http = createEndpoint('/auth');

export const auth = {
  login: async (data: LoginData): Promise<LoginResponse> =>
    await http.post<LoginResponse>('/login', data, {
      auth: true,
      ...cacheStrategies.dynamic,
    }),

  register: async (data: RegisterData): Promise<RegisterResponse> =>
    await http.post<RegisterResponse>('/register', data, {
      ...cacheStrategies.dynamic,
    }),

  verifyEmail: async (data: VerifyEmailData): Promise<VerifyEmailResponse> =>
    await http.post<VerifyEmailResponse>('/verify-email', data, {
      ...cacheStrategies.dynamic,
    }),

  resendVerification: async (
    data: ResendVerificationData,
  ): Promise<ResendVerificationResponse> =>
    await http.post<ResendVerificationResponse>('/resend-verif', data, {
      ...cacheStrategies.dynamic,
    }),

  changePassword: async (
    data: ChangePasswordData,
  ): Promise<ChangePasswordResponse> =>
    await http.post<ChangePasswordResponse>('/change-password', data, {
      auth: true,
      ...cacheStrategies.dynamic,
    }),

  forgotPasswordRequest: async (
    data: ForgotPasswordRequestData,
  ): Promise<ForgotPasswordRequestResponse> =>
    await http.post<ForgotPasswordRequestResponse>(
      '/forgot-password-request',
      data,
      { ...cacheStrategies.dynamic },
    ),

  forgotPasswordVerify: async (
    data: ForgotPasswordVerifyData,
  ): Promise<ForgotPasswordVerifyResponse> =>
    await http.post<ForgotPasswordVerifyResponse>(
      '/forgot-password-verify',
      data,
      { ...cacheStrategies.dynamic },
    ),

  forgotPasswordReset: async (
    data: ForgotPasswordResetData,
  ): Promise<ForgotPasswordResetResponse> =>
    await http.post<ForgotPasswordResetResponse>(
      '/forgot-password-reset',
      data,
      { ...cacheStrategies.dynamic },
    ),

  logout: async (): Promise<void> =>
    await http.post<void>('/logout', undefined, {
      auth: true,
      ...cacheStrategies.dynamic,
    }),

  getMe: async (): Promise<CurrentUserResponse> =>
    await http.get<CurrentUserResponse>('/me', {
      auth: true,
      next: { revalidate: 60, tags: ['current-user'] },
    }),
};
