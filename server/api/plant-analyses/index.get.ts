import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const query = getQuery(event);
  const fieldId = query.fieldId as string | undefined;
  const healthy = query.healthy as string | undefined;

  const where: Record<string, unknown> = {};

  if (fieldId) {
    where.fieldId = fieldId;
  }

  if (healthy === "true" || healthy === "false") {
    where.healthy = healthy === "true";
  }

  if (user.role !== "ADMIN") {
    where.field = { farm: { is: { ownerId: getUserIdNumber(user) } } };
  }

  const analyses = await prisma.plantAnalysis.findMany({
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

  return analyses;
});
