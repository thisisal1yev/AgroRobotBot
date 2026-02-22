import type { H3Event } from "h3";

/**
 * Get and parse route param as integer id for Prisma (Int @id).
 */
export function getRouterId(event: H3Event, param = "id"): number {
  const raw = getRouterParam(event, param);
  const id = raw ? parseInt(raw, 10) : NaN;
  if (Number.isNaN(id)) {
    throw createError({ statusCode: 400, message: "Invalid id" });
  }
  return id;
}
