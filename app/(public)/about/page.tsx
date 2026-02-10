import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Eye, Lightbulb, Users, Globe, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Hiraya',
  description:
    'Learn about Hiraya — a large-scale skill matching platform and capability graph designed to bridge the gap between talent and opportunity.',
};

const VALUES = [
  {
    icon: Target,
    title: 'Accuracy',
    description:
      'Graph-based matching goes beyond keyword scanning to surface candidates who truly fit.',
  },
  {
    icon: Eye,
    title: 'Transparency',
    description:
      'Every recommendation is explainable — no black-box algorithms hiding decisions.',
  },
  {
    icon: Lightbulb,
    title: 'Evidence-Driven',
    description:
      'Skills backed by certifications, portfolios, and real project evidence — not just self-reported claims.',
  },
  {
    icon: Users,
    title: 'Equity',
    description:
      'Fair matching that levels the playing field for professionals regardless of background.',
  },
  {
    icon: Globe,
    title: 'Openness',
    description:
      'An interconnected graph that grows with every user, skill, and role definition added.',
  },
  {
    icon: Sparkles,
    title: 'Growth',
    description:
      'Personalized recommendations help professionals discover new skills and career paths.',
  },
] as const;

const TIMELINE = [
  { year: '2025', event: 'Research & initial design of the capability graph model.' },
  { year: '2026 Q1', event: 'Early access launch — identity, skills, and evidence modules.' },
  { year: '2026 Q2', event: 'Role postings, employer dashboards, and smart matching engine.' },
  { year: '2026 Q3', event: 'Admin tools, audit trails, and organization management.' },
] as const;

export default function Page() {
  return (
    <>
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6">
              About Us
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Rethinking how talent meets opportunity
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Traditional hiring relies on keyword matching and static resumes. Hiraya takes
              a fundamentally different approach — modeling the entire talent ecosystem as a
              living graph of skills, capabilities, evidence, and roles.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 text-muted-foreground">
              The principles that guide every feature, algorithm, and design decision.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((value) => (
              <Card key={value.title} className="transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <value.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Roadmap
            </h2>
            <p className="mt-4 text-muted-foreground">
              Where we&apos;ve been and where we&apos;re headed.
            </p>
          </div>

          <div className="mx-auto max-w-xl">
            <div className="relative border-l-2 border-primary/20 pl-8 space-y-10">
              {TIMELINE.map((item) => (
                <div key={item.year} className="relative">
                  <div className="absolute -left-9.25 top-1 h-3 w-3 rounded-full bg-primary" />
                  <p className="text-sm font-semibold text-primary">{item.year}</p>
                  <p className="mt-1 text-muted-foreground">{item.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
