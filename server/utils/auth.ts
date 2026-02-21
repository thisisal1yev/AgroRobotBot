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
