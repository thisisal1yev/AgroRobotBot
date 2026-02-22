import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = getRouterId(event);

  const farm = await prisma.farm.findUnique({ where: { id } });
  if (!farm) {
    throw createError({ statusCode: 404, message: "Farm not found" });
  }

  await requireOwnerOrAdmin(event, farm.ownerId);

  await prisma.farm.delete({ where: { id } });

  return { success: true };
});
