import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  FileCheck2,
  Network,
  Search,
  Shield,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Network,
    title: 'Capability Graph',
    description:
      'Model skills, capabilities, and roles as interconnected entities for deeper insight into talent potential.',
  },
  {
    icon: BrainCircuit,
    title: 'Smart Matching',
    description:
      'Go beyond keyword matching. Our graph-based engine surfaces candidates that truly fit role requirements.',
  },
  {
    icon: FileCheck2,
    title: 'Evidence-Based',
    description:
      'Attach certifications, portfolios, and project evidence to skills for verifiable, trustworthy profiles.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description:
      'Track skill gaps, workforce readiness, and market trends with real-time dashboards.',
  },
  {
    icon: Search,
    title: 'Role Discovery',
    description:
      'Explore curated role definitions with required capabilities, seniority levels, and growth paths.',
  },
  {
    icon: Shield,
    title: 'Transparent & Fair',
    description:
      'Every match is explainable. Understand exactly why a candidate was recommended for a role.',
  },
] as const;

const STATS = [
  { value: '10,000+', label: 'Skills Mapped' },
  { value: '2,500+', label: 'Roles Defined' },
  { value: '50,000+', label: 'Professionals' },
  { value: '98%', label: 'Match Accuracy' },
] as const;

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6">
              Now in Early Access
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Match talent to roles with a{' '}
              <span className="text-primary">capability graph</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Hiraya models skills, evidence, and roles as an interconnected graph — enabling
              smarter, fairer, and more transparent hiring for everyone.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/postings">Browse Postings</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to bridge the skill gap
            </h2>
            <p className="mt-4 text-muted-foreground">
              From skill discovery to verified matching — Hiraya covers the full talent
              lifecycle.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card
                key={feature.title}
                className="group relative overflow-hidden transition-shadow hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to find your perfect match?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of professionals and employers already using Hiraya to make
              smarter hiring decisions.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">
                  Create Free Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
