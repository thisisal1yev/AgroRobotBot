import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  const field = await prisma.field.findUnique({
    where: { id },
    include: { farm: { select: { ownerId: true } } },
  });
  if (!field) {
    throw createError({ statusCode: 404, message: "Field not found" });
  }

  await requireOwnerOrAdmin(event, field.farm.ownerId);

  await prisma.field.delete({ where: { id } });

  return { success: true };
});
