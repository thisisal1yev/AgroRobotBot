import type { H3Event } from "h3";

export async function requireAuth(event: H3Event) {
  const session = await getUserSession(event);

  if (!session.user) {
    throw createError({ statusCode: 401, message: "Not authenticated" });
  }

  return session.user;
}

export async function requireAdmin(event: H3Event) {
  const user = await requireAuth(event);

  if (user.role !== "ADMIN") {
    throw createError({ statusCode: 403, message: "Admin access required" });
  }

  return user;
}

export async function requireOwnerOrAdmin(event: H3Event, ownerId: number) {
  const user = await requireAuth(event);

  if (user.role !== "ADMIN" && (user.id as number) !== ownerId) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }

  return user;
}

/**
 * Returns the current user's id as a number for Prisma (Int id).
 * Throws 401 if session user id is missing or not a valid integer (e.g. old cuid in session).
 */
export function getUserIdNumber(user: { id?: unknown }): number {
  const id = Number(user?.id);
  if (Number.isNaN(id) || !Number.isInteger(id) || id < 1) {
    throw createError({ statusCode: 401, message: "Invalid session" });
  }
  return id;
}
