'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { ArrowRight, Briefcase, Clock, MapPin, Search } from 'lucide-react';

const SAMPLE_POSTINGS = [
  {
    id: 'post-1',
    title: 'Senior Full-Stack Engineer',
    company: 'TechCorp Solutions',
    location: 'Remote',
    type: 'Full-time',
    posted: '2 days ago',
    skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    description:
      'Build and maintain large-scale web applications with a focus on real-time data processing.',
  },
  {
    id: 'post-2',
    title: 'Data Scientist',
    company: 'AnalyticaAI',
    location: 'Manila, PH',
    type: 'Full-time',
    posted: '5 days ago',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    description:
      'Develop predictive models and data pipelines to drive business intelligence initiatives.',
  },
  {
    id: 'post-3',
    title: 'UI/UX Designer',
    company: 'DesignHub Studio',
    location: 'Hybrid — Cebu, PH',
    type: 'Contract',
    posted: '1 week ago',
    skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
    description:
      'Lead the design of user-centered interfaces for a suite of B2B SaaS products.',
  },
  {
    id: 'post-4',
    title: 'DevOps Engineer',
    company: 'CloudFirst Inc.',
    location: 'Remote',
    type: 'Full-time',
    posted: '3 days ago',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
    description:
      'Architect and manage CI/CD pipelines and cloud infrastructure for high-availability systems.',
  },
  {
    id: 'post-5',
    title: 'Product Manager',
    company: 'InnoVenture Labs',
    location: 'Makati, PH',
    type: 'Full-time',
    posted: '1 day ago',
    skills: ['Roadmapping', 'Agile', 'Stakeholder Management', 'Analytics'],
    description:
      'Define product vision and strategy for a graph-powered talent intelligence platform.',
  },
  {
    id: 'post-6',
    title: 'Mobile Developer',
    company: 'AppForge',
    location: 'Remote',
    type: 'Part-time',
    posted: '4 days ago',
    skills: ['React Native', 'Expo', 'TypeScript', 'REST APIs'],
    description:
      'Develop cross-platform mobile applications with a focus on performance and accessibility.',
  },
] as const;

const JOB_TYPES = ['All Types', 'Full-time', 'Part-time', 'Contract'] as const;

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobType, setJobType] = useState<string>('All Types');

  const filtered = SAMPLE_POSTINGS.filter((posting) => {
    const matchesSearch =
      posting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      posting.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      posting.skills.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesType = jobType === 'All Types' || posting.type === jobType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Job Postings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explore open positions matched by skills, capabilities, and verified
          evidence.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, company, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={jobType} onValueChange={setJobType}>
          <SelectTrigger className="w-full sm:w-45">
            <SelectValue placeholder="Job type" />
          </SelectTrigger>
          <SelectContent>
            {JOB_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-lg font-semibold">No postings found</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((posting) => (
            <Card
              key={posting.id}
              className="group transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-lg font-semibold">{posting.title}</h2>
                      <Badge variant="outline">{posting.type}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {posting.company}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {posting.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {posting.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {posting.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {posting.posted}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="shrink-0 self-start"
                  >
                    <Link href={`/postings/${posting.id}`}>
                      View Details
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
        Showing {filtered.length} of {SAMPLE_POSTINGS.length} postings
      </div>
    </div>
  );
}
