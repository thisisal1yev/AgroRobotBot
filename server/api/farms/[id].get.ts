import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const id = getRouterId(event);

  const farm = await prisma.farm.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      fields: true,
      robots: true,
      seasons: { orderBy: { startDate: "desc" } },
      _count: { select: { fields: true, robots: true, reports: true } },
    },
  });

  if (!farm) {
    throw createError({ statusCode: 404, message: "Farm not found" });
  }

  if (user.role !== "ADMIN" && farm.ownerId !== getUserIdNumber(user)) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }

  return farm;
});
