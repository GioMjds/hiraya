export const ONBOARDING_STEPS_COUNT = 8 as const;

export type OnboardingPersona =
  | 'STUDENT'
  | 'JOB_SEEKER'
  | 'PROFESSIONAL'
  | 'CAREER_SHIFTER'
  | 'EMPLOYER';

export type EvidenceType =
  | 'PROJECT'
  | 'REPOSITORY'
  | 'CERTIFICATE'
  | 'ASSESSMENT'
  | 'EXPERIENCE';

export type YearsExperience = '0' | '1-2' | '3-5' | '6-10' | '10+';

export type OnboardingGoal =
  | 'GET_MATCHES'
  | 'FIND_SKILL_GAPS'
  | 'VALIDATE_SKILLS'
  | 'EXPLORE_PATHS'
  | 'CREATE_ROLES'
  | 'VIEW_CANDIDATE_MATCHES'
  | 'MANAGE_ORGANIZATION';

export interface OnboardingFormState {
  persona: OnboardingPersona | '';
  goal: OnboardingGoal | '';
  yearsExperience: YearsExperience | '';
  location: string;
  currentFocus: string;
  targetOutcome: string;
  evidenceTypes: EvidenceType[];
  hasOrganization: boolean | null;
  organizationName: string;
}

export const PERSONA_OPTIONS: Array<{ value: OnboardingPersona; label: string }> = [
  { value: 'STUDENT', label: 'Student' },
  { value: 'JOB_SEEKER', label: 'Job seeker' },
  { value: 'PROFESSIONAL', label: 'Professional' },
  { value: 'CAREER_SHIFTER', label: 'Career shifter' },
  { value: 'EMPLOYER', label: 'Employer / recruiter' },
];

export const YEARS_EXPERIENCE_OPTIONS: Array<{
  value: YearsExperience;
  label: string;
}> = [
  { value: '0', label: '0 years' },
  { value: '1-2', label: '1–2 years' },
  { value: '3-5', label: '3–5 years' },
  { value: '6-10', label: '6–10 years' },
  { value: '10+', label: '10+ years' },
];

export const EVIDENCE_TYPE_OPTIONS: Array<{
  value: EvidenceType;
  label: string;
  description: string;
}> = [
  { value: 'PROJECT', label: 'Project', description: 'Project descriptions and write-ups' },
  { value: 'REPOSITORY', label: 'Repository', description: 'Public code repository links' },
  { value: 'CERTIFICATE', label: 'Certificate', description: 'Certifications and credentials' },
  { value: 'ASSESSMENT', label: 'Assessment', description: 'Test results or evaluations' },
  { value: 'EXPERIENCE', label: 'Experience', description: 'Work or volunteer experience' },
];

export function getGoalOptions(
  persona: OnboardingPersona | '',
): Array<{ value: OnboardingGoal; label: string; description: string }> {
  if (persona === 'EMPLOYER') {
    return [
      {
        value: 'CREATE_ROLES',
        label: 'Create roles and postings',
        description: 'Define role requirements and publish postings',
      },
      {
        value: 'VIEW_CANDIDATE_MATCHES',
        label: 'View candidate matches',
        description: 'See ranked candidates with fit scores',
      },
      {
        value: 'MANAGE_ORGANIZATION',
        label: 'Manage organization',
        description: 'Set up your organization and team members',
      },
    ];
  }

  return [
    {
      value: 'GET_MATCHES',
      label: 'Get role matches',
      description: 'See fit scores against roles and postings',
    },
    {
      value: 'FIND_SKILL_GAPS',
      label: 'Find skill gaps',
      description: 'Identify what to learn next to qualify for a target role',
    },
    {
      value: 'VALIDATE_SKILLS',
      label: 'Validate skills with evidence',
      description: 'Attach evidence like projects and repositories',
    },
    {
      value: 'EXPLORE_PATHS',
      label: 'Explore career paths',
      description: 'Map skills → capabilities → roles to plan growth',
    },
  ];
}
