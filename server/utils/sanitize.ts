import type { User } from "@prisma/client";

/**
 * Sanitized user type (without password)
 */
export type SafeUser = Omit<User, "password">;

/**
 * Sanitize user object by removing sensitive fields.
 * Always use this before returning user data in API responses.
 */
export function sanitizeUser(user: User): SafeUser {
  const { password, ...sanitized } = user;
  return sanitized;
}

/**
 * User fields that are safe to include in API responses.
 */
export const USER_SAFE_FIELDS = [
  "id",
  "email",
  "name",
  "role",
  "createdAt",
  "updatedAt",
] as const;

/**
 * Extended user type with additional fields for admin views
 */
export type SafeUserWithRelations = SafeUser & {
  farms?: Array<{
    id: number;
    name: string;
    location: string;
    area: number;
    soilType: string;
    createdAt: string;
    _count: {
      fields: number;
      robots: number;
    };
  }>;
  reports?: Array<{
    id: number;
    title: string;
    type: string;
    fileUrl: string | null;
    generatedAt: string;
  }>;
  _count?: {
    farms: number;
    reports: number;
  };
};
