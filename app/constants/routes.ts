import type { UserRole } from "~/constants/roles";

export const ROLE_REDIRECTS: Record<UserRole, string> = {
  ADMIN: "/admin",
  FARMER: "/farmer",
};
