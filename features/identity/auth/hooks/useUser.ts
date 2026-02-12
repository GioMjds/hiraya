import { useQuery } from '@tanstack/react-query';
import { auth } from '@/lib/api';

export function useUser() {
  const { data, isLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => auth.getMe(),
    enabled: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return { data: data, isLoading: isLoading };
}
