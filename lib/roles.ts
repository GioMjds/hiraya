export const VALID_ROLES = ['admin', 'staff'] as const;
export type Role = typeof VALID_ROLES[number];

export function isValidRole(role: string): role is Role {
  return VALID_ROLES.includes(role as Role);
}

// Define which routes are accessible by each role
export const ROLE_ROUTES: Record<Role, string[]> = {
  admin: [
    '/admin',
    '/admin/users',
    '/admin/analytics',
    '/admin/reports',
    '/admin/settings'
  ],
  staff: [
    '/staff',
    '/staff/reports'
  ]
};

export function canAccessRoute(role: Role, path: string): boolean {
  const allowedRoutes = ROLE_ROUTES[role];
  
  // Check if the path matches any allowed route
  return allowedRoutes.some(route => {
    // Exact match
    if (path === route) return true;
    // Allow sub-routes (e.g., /admin/users/123)
    if (path.startsWith(route + '/')) return true;
    return false;
  });
}

// Get the default route for a role
export function getDefaultRoute(role: Role): string {
  return ROLE_ROUTES[role][0] || `/${role}`;
}
