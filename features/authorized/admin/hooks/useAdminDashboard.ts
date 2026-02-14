import { useQuery } from '@tanstack/react-query';
import { admin } from '@/lib/api/authorized/admin';

export const adminDashboardQueryKeys = {
  all: ['authorized-admin', 'dashboard'],
  detail: () => [...adminDashboardQueryKeys.all, 'detail'],
};

export function useGetAdminDashboard() {
  return useQuery({
    queryKey: adminDashboardQueryKeys.detail(),
    queryFn: async () => await admin.getDashboard(),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}
