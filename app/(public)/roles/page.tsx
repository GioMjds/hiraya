'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRight, Layers, Search } from 'lucide-react';

const SENIORITY_LEVELS = [
  'All Levels',
  'Entry',
  'Mid',
  'Senior',
  'Lead',
  'Principal',
] as const;

const SAMPLE_ROLES = [
  {
    id: 'role-1',
    title: 'Full-Stack Developer',
    domain: 'Engineering',
    seniority: 'Senior',
    capabilities: 6,
    skills: ['TypeScript', 'React', 'NestJS', 'PostgreSQL'],
    description:
      'Designs, builds, and maintains both client and server applications as part of a product team.',
  },
  {
    id: 'role-2',
    title: 'Data Analyst',
    domain: 'Data & Analytics',
    seniority: 'Mid',
    capabilities: 4,
    skills: ['SQL', 'Python', 'Tableau', 'Statistics'],
    description:
      'Transforms raw data into actionable insights through analysis, visualization, and reporting.',
  },
  {
    id: 'role-3',
    title: 'Product Designer',
    domain: 'Design',
    seniority: 'Senior',
    capabilities: 5,
    skills: ['Figma', 'User Research', 'Interaction Design', 'Accessibility'],
    description:
      'Leads the design process from research to high-fidelity prototyping for digital products.',
  },
  {
    id: 'role-4',
    title: 'Cloud Engineer',
    domain: 'Infrastructure',
    seniority: 'Mid',
    capabilities: 5,
    skills: ['AWS', 'Terraform', 'Docker', 'Linux'],
    description:
      'Manages cloud infrastructure, automates deployments, and ensures system reliability.',
  },
  {
    id: 'role-5',
    title: 'Machine Learning Engineer',
    domain: 'AI & Machine Learning',
    seniority: 'Lead',
    capabilities: 7,
    skills: ['Python', 'TensorFlow', 'MLOps', 'Feature Engineering'],
    description:
      'Builds and deploys production machine learning systems that power intelligent features.',
  },
  {
    id: 'role-6',
    title: 'QA Engineer',
    domain: 'Engineering',
    seniority: 'Entry',
    capabilities: 3,
    skills: ['Test Automation', 'Selenium', 'Cypress', 'API Testing'],
    description:
      'Ensures product quality through manual and automated testing, reporting defects and regressions.',
  },
] as const;

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [seniority, setSeniority] = useState<string>('All Levels');

  const filtered = SAMPLE_ROLES.filter((role) => {
    const matchesSearch =
      role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.skills.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesSeniority =
      seniority === 'All Levels' || role.seniority === seniority;
    return matchesSearch && matchesSeniority;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Role Definitions
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse curated role templates with required capabilities, growth
          paths, and skill expectations.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by role, domain, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={seniority} onValueChange={setSeniority}>
          <SelectTrigger className="w-full sm:w-45">
            <SelectValue placeholder="Seniority" />
          </SelectTrigger>
          <SelectContent>
            {SENIORITY_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Layers className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-lg font-semibold">No roles found</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((role) => (
            <Card
              key={role.id}
              className="group flex flex-col transition-shadow hover:shadow-lg"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {role.domain}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {role.seniority}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-2">{role.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {role.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {role.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="text-xs font-normal"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {role.capabilities} capabilities
                  </span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/roles/${role.id}`}>
                      Explore
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Showing {filtered.length} of {SAMPLE_ROLES.length} roles
      </div>
    </div>
  );
}
