import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default:
      'Hiraya - A Large-Scale Skill Matching Platform and Capability Graph for Job Seekers, Employers and Professionals',
    template: '%s',
  },
  description:
    'Hiraya is a platform designed to address the fundamental limitations of traditional hiring and skill assessment systems. By modeling skills, capabilities, and roles as interconnected entities within a graph structure, Hiraya enables more accurate, transparent, and fair matching between job seekers and opportunities.',
};

export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return <main className="min-h-screen bg-background">{children}</main>;
}
