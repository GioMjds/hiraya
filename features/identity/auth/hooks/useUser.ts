import { auth } from '@/repositories';
import useSWR from 'swr';

export function useUser() {
  const { data, isLoading } = useSWR('current-user', () => auth.getMe());

  return { data: data, isLoading: isLoading };
}
