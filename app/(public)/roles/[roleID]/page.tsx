import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export async function generateMetadata({
  params,
}: PageProps<'/roles/[roleID]'>): Promise<Metadata> {
  const { roleID } = await params;
  return {
    title: `Role ${roleID}`,
  };
}

const SAMPLE_ROLE = {
  title: 'Full-Stack Developer',
  domain: 'Engineering',
  seniority: 'Senior',
  description:
    'A senior full-stack developer designs, builds, and maintains both client-side and server-side applications. They collaborate with cross-functional teams, mentor junior developers, and make architectural decisions that impact the product roadmap.',
  capabilities: [
    {
      name: 'Frontend Development',
      level: 'Advanced',
      skills: ['React', 'Next.js', 'TypeScript', 'CSS/Tailwind'],
    },
    {
      name: 'Backend Development',
      level: 'Advanced',
      skills: ['NestJS', 'Node.js', 'REST APIs', 'GraphQL'],
    },
    {
      name: 'Database Design',
      level: 'Intermediate',
      skills: ['PostgreSQL', 'Prisma', 'Redis', 'Query Optimization'],
    },
    {
      name: 'DevOps & CI/CD',
      level: 'Intermediate',
      skills: ['Docker', 'GitHub Actions', 'Cloud Platforms'],
    },
    {
      name: 'System Architecture',
      level: 'Intermediate',
      skills: ['Microservices', 'Event-Driven', 'Domain-Driven Design'],
    },
    {
      name: 'Team Leadership',
      level: 'Foundational',
      skills: ['Code Review', 'Mentoring', 'Technical Writing'],
    },
  ],
  growthPaths: [
    {
      role: 'Staff Engineer',
      description: 'Deep technical leadership across multiple teams.',
    },
    {
      role: 'Engineering Manager',
      description: 'People management and engineering operations.',
    },
    {
      role: 'Principal Engineer',
      description: 'Organization-wide technical strategy and vision.',
    },
  ],
  relatedPostings: 12,
} as const;

const LEVEL_COLORS: Record<string, string> = {
  Foundational: 'bg-muted text-muted-foreground',
  Intermediate: 'bg-primary/10 text-primary',
  Advanced: 'bg-accent/20 text-accent-foreground',
};

export default async function Page({ params }: PageProps<'/roles/[roleID]'>) {
  const { roleID } = await params;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/roles">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Roles
        </Link>
      </Button>

      <div className="mb-8">
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {SAMPLE_ROLE.title}
          </h1>
          <Badge variant="secondary">{SAMPLE_ROLE.domain}</Badge>
          <Badge variant="outline">{SAMPLE_ROLE.seniority}</Badge>
        </div>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          {SAMPLE_ROLE.description}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">Role ID: {roleID}</p>
      </div>

      <Separator className="mb-8" />

      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Required Capabilities</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {SAMPLE_ROLE.capabilities.map((capability) => (
            <Card key={capability.name}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{capability.name}</CardTitle>
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${LEVEL_COLORS[capability.level] ?? ''}`}
                  >
                    {capability.level}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {capability.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Growth Paths</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {SAMPLE_ROLE.growthPaths.map((path) => (
            <Card key={path.role} className="transition-shadow hover:shadow-lg">
              <CardContent className="p-5">
                <CheckCircle2 className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold">{path.role}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {path.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Card className="bg-muted/30">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">
              {SAMPLE_ROLE.relatedPostings} open postings for this role
            </h3>
            <p className="text-sm text-muted-foreground">
              Explore matching job opportunities that require this role&apos;s
              capabilities.
            </p>
          </div>
          <Button asChild>
            <Link href="/postings">
              View Postings
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
