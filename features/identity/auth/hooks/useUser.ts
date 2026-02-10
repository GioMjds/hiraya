import { auth } from '@/lib/api';
import useSWR from 'swr';

export function useUser() {
  const { data, isLoading } = useSWR('current-user', () => auth.getMe());

  return { data: data, isLoading: isLoading };
}
