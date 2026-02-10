import type { Metadata } from 'next';
import { RegisterForm } from '@/features/identity';

export const metadata: Metadata = {
  title: 'Join Hiraya - Create Your Account and Start Building Your Skill-Based Profile',
  description: 'Join Hiraya and start building your skill-based profile today.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
