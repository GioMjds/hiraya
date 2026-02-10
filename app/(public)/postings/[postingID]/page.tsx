import Link from 'next/link';
import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  MapPin,
} from 'lucide-react';

export async function generateMetadata({
  params,
}: PageProps<'/postings/[postingID]'>): Promise<Metadata> {
  const { postingID } = await params;
  return {
    title: `Posting ${postingID}`,
  };
}

const SAMPLE_POSTING = {
  title: 'Senior Full-Stack Engineer',
  company: 'TechCorp Solutions',
  location: 'Remote',
  type: 'Full-time',
  posted: 'February 8, 2026',
  deadline: 'March 8, 2026',
  experience: '5+ years',
  description:
    'We are looking for a seasoned full-stack engineer to join our platform team. You will design, build, and maintain large-scale web applications with a focus on real-time data processing and graph-based analytics. This role involves working closely with the product and data science teams.',
  responsibilities: [
    'Architect and implement scalable microservices using NestJS and PostgreSQL',
    'Build rich, responsive front-end experiences with Next.js and React',
    'Design and optimize graph-based data models for talent matching',
    'Collaborate with cross-functional teams to define technical requirements',
    'Mentor junior engineers and conduct code reviews',
    'Maintain CI/CD pipelines and ensure high code quality',
  ],
  requirements: [
    '5+ years of experience with TypeScript and modern web frameworks',
    'Strong knowledge of relational databases and query optimization',
    'Experience with graph databases or graph algorithms is a plus',
    'Familiarity with Docker, Kubernetes, and cloud platforms (AWS/GCP)',
    'Excellent problem-solving and communication skills',
  ],
  skills: [
    'TypeScript',
    'React',
    'Next.js',
    'NestJS',
    'PostgreSQL',
    'Docker',
    'GraphQL',
    'Redis',
  ],
} as const;

export default async function Page({
  params,
}: PageProps<'/postings/[postingID]'>) {
  const { postingID } = await params;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/postings">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Postings
        </Link>
      </Button>

      <div className="mb-8">
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {SAMPLE_POSTING.title}
          </h1>
          <Badge variant="outline">{SAMPLE_POSTING.type}</Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <Building2 className="h-4 w-4" />
            {SAMPLE_POSTING.company}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {SAMPLE_POSTING.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Briefcase className="h-4 w-4" />
            {SAMPLE_POSTING.experience}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {SAMPLE_POSTING.description}
            </p>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3">Responsibilities</h2>
            <ul className="space-y-2">
              {SAMPLE_POSTING.responsibilities.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <Separator />

          <section>
            <h2 className="text-xl font-semibold mb-3">Requirements</h2>
            <ul className="space-y-2">
              {SAMPLE_POSTING.requirements.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_POSTING.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Posted: {SAMPLE_POSTING.posted}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Deadline: {SAMPLE_POSTING.deadline}</span>
              </div>
              <Separator />
              <p className="text-xs text-muted-foreground">
                Posting ID: {postingID}
              </p>
            </CardContent>
          </Card>

          <Button size="lg" className="w-full" asChild>
            <Link href="/register">Apply Now</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
