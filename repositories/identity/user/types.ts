export interface GetUserByIdDto {
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