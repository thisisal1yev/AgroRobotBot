/**
 * User role constants for consistent usage across the application.
 * These values must match the Role enum in Prisma schema.
 */

export const Role = {
  ADMIN: "ADMIN" as const,
  FARMER: "FARMER" as const,
} as const;

export type UserRole = (typeof Role)[keyof typeof Role];

/**
 * Check if a role is valid
 */
export function isValidRole(role: string): role is UserRole {
  return Object.values(Role).includes(role as UserRole);
}

/**
 * Get human-readable label for a role
 */
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    [Role.ADMIN]: "Admin",
    [Role.FARMER]: "Farmer",
  };
  return labels[role];
}
