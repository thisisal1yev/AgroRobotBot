import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  const season = await prisma.season.findUnique({
    where: { id },
    include: { farm: { select: { ownerId: true } } },
  });
  if (!season) {
    throw createError({ statusCode: 404, message: "Season not found" });
  }

  await requireOwnerOrAdmin(event, season.farm.ownerId);

  await prisma.season.delete({ where: { id } });

  return { success: true };
});
