import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { user } from '@/lib/api/authorized/user';
import type { UpdateUserProfileData } from '@/lib/api/authorized/user';

export const userProfileQueryKeys = {
  all: ['authorized-user'],
  dashboard: () => [...userProfileQueryKeys.all, 'dashboard'],
  profile: () => [...userProfileQueryKeys.all, 'profile'],
};

export function useGetDashboard() {
  return useQuery({
    queryKey: userProfileQueryKeys.dashboard(),
    queryFn: async () => await user.getDashboard(),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useGetProfile() {
  return useQuery({
    queryKey: userProfileQueryKeys.profile(),
    queryFn: async () => await user.getProfile(),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserProfileData) =>
      await user.updateProfile(data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: userProfileQueryKeys.profile() }),
        queryClient.invalidateQueries({ queryKey: userProfileQueryKeys.dashboard() }),
      ]);
    },
  });
}
