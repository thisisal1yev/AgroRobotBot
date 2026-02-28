import { prisma } from "~~/prisma/db";
import { Role } from "~~/shared/roles";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const query = getQuery(event);
  const fieldId = query.fieldId as string | undefined;
  const status = query.status as string | undefined;

  const where: Record<string, unknown> = {};

  if (fieldId) {
    where.fieldId = fieldId;
  }

  if (status === "ACTIVE" || status === "RESOLVED") {
    where.status = status;
  }

  if (user.role !== Role.ADMIN) {
    where.field = { farm: { is: { ownerId: getUserIdNumber(user) } } };
  }

  const alerts = await prisma.alert.findMany({
    where,
    include: {
      field: {
        select: {
          id: true,
          name: true,
          farm: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return alerts;
});
