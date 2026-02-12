import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/lib/api';
import { useRouter } from 'next/navigation';

export function useUser() {
  const { data, isLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => await auth.getMe(),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return { data, isLoading };
}

export function useUserLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => await auth.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      router.push('/login');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });
}