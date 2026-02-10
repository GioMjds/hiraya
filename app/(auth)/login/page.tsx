import type { Metadata } from 'next';
import { LoginForm } from '@/features/identity';

export const metadata: Metadata = {
  title: 'Welcome Back - Sign In to Your Hiraya Account',
  description: 'Sign in to your Hiraya account to access your skills profile, matches, and more.',
};

export default function LoginPage() {
  return <LoginForm />;
}
