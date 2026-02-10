import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/features/identity';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your Hiraya password securely.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
