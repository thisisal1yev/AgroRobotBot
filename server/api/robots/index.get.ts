import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const query = getQuery(event);
  const farmId = query.farmId as string | undefined;

  const where: Record<string, unknown> = {};

  if (farmId) {
    where.farmId = farmId;
  }

  if (user.role !== "ADMIN") {
    where.farm = { is: { ownerId: getUserIdNumber(user) } };
  }

  const robots = await prisma.robot.findMany({
    where,
    include: {
      farm: { select: { id: true, name: true } },
      _count: { select: { missions: true, telemetryReadings: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return robots;
});
