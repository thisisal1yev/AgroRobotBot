import { prisma } from "~~/prisma/db";
import { Role } from "~~/shared/roles";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const query = getQuery(event);
  const farmId = query.farmId as string | undefined;

  const where: Record<string, unknown> = {};

  if (farmId) {
    where.farmId = farmId;
  }

  if (user.role !== Role.ADMIN) {
    where.farm = { is: { ownerId: getUserIdNumber(user) } };
  }

  const fields = await prisma.field.findMany({
    where,
    include: {
      farm: { select: { id: true, name: true } },
      _count: {
        select: {
          telemetryReadings: true,
          alerts: true,
          recommendations: true,
          plantAnalyses: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return fields;
});
