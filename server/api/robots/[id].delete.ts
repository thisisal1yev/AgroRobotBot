import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = getRouterId(event);

  const robot = await prisma.robot.findUnique({
    where: { id },
    include: { farm: { select: { ownerId: true } } },
  });
  if (!robot) {
    throw createError({ statusCode: 404, message: "Robot not found" });
  }

  await requireOwnerOrAdmin(event, robot.farm.ownerId);

  await prisma.robot.delete({ where: { id } });

  return { success: true };
});
