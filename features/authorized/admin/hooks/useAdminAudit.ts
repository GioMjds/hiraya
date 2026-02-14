import { useQuery } from '@tanstack/react-query';
import { admin } from '@/lib/api/authorized/admin';

export const adminAuditQueryKeys = {
  all: ['authorized-admin', 'audit'],
  list: (page: number, limit: number) => [...adminAuditQueryKeys.all, 'list', page, limit],
};

export function useGetAdminAuditLogs(params?: { page?: number; limit?: number }) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;

  return useQuery({
    queryKey: adminAuditQueryKeys.list(page, limit),
    queryFn: async () => await admin.auditLogs({ page, limit }),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}
