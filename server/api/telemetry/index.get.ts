import { prisma } from "~~/prisma/db";
import { Role } from "~~/shared/roles";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const query = getQuery(event);
  const fieldId = query.fieldId as string | undefined;
  const robotId = query.robotId as string | undefined;
  const limit = Math.min(Number(query.limit) || 50, 200);

  const where: Record<string, unknown> = {};

  if (fieldId) {
    where.fieldId = fieldId;
  }

  if (robotId) {
    where.robotId = robotId;
  }

  if (user.role !== Role.ADMIN) {
    where.field = { farm: { is: { ownerId: getUserIdNumber(user) } } };
  }

  const readings = await prisma.telemetryReading.findMany({
    where,
    include: {
      field: { select: { id: true, name: true } },
      robot: { select: { id: true, name: true } },
    },
    orderBy: { recordedAt: "desc" },
    take: limit,
  });

  return readings;
});
