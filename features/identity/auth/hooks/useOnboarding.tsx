import { useMutation } from '@tanstack/react-query';
import { auth } from '@/lib/api';
import type {
  OnboardingSurveyData,
  OnboardingSurveyResponse,
} from '@/lib/api/identity/auth';

export function useOnboarding() {
  return useMutation<OnboardingSurveyResponse, Error, OnboardingSurveyData>({
    mutationFn: async (payload) => await auth.answerOnboardingSurvey(payload),
  });
}
