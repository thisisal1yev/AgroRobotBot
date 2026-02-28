import type { UserRole } from "~~/shared/roles";

declare module "auth-utils" {
  interface User {
    id: number;
    email: string;
    name: string | null;
    role: UserRole;
  }
}

export {};
