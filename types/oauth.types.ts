export interface GoogleOAuthData {
  idToken: string;
}

export interface GoogleOAuthResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    isActive: boolean;
    isEmailVerified: boolean;
    isSurveyDone: boolean;
    role: 'ADMIN' | 'USER' | 'EMPLOYER';
    archivedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  accessToken: string;
}