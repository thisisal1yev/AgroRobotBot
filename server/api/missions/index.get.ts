import { prisma } from "~~/prisma/db";
import { Role } from "~~/shared/roles";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const query = getQuery(event);
  const robotId = query.robotId as string | undefined;
  const status = query.status as string | undefined;

  const where: Record<string, unknown> = {};

  if (robotId) {
    where.robotId = robotId;
  }

  if (status) {
    where.status = status;
  }

  if (user.role !== Role.ADMIN) {
    where.robot = { farm: { is: { ownerId: getUserIdNumber(user) } } };
  }

  const missions = await prisma.mission.findMany({
    where,
    include: {
      robot: { select: { id: true, name: true } },
      field: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return missions;
});
