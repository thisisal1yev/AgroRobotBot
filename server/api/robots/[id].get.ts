import { prisma } from "~~/prisma/db";
import { Role } from "~~/shared/roles";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const id = getRouterId(event);

  const robot = await prisma.robot.findUnique({
    where: { id },
    include: {
      farm: {
        select: { id: true, name: true, ownerId: true },
      },
      missions: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          field: { select: { id: true, name: true } },
        },
      },
      _count: { select: { missions: true, telemetryReadings: true } },
    },
  });

  if (!robot) {
    throw createError({ statusCode: 404, message: "Robot not found" });
  }

  if (user.role !== Role.ADMIN && robot.farm.ownerId !== getUserIdNumber(user)) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }

  return robot;
});
