import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const query = getQuery(event);
  const fieldId = query.fieldId as string | undefined;
  const applied = query.applied as string | undefined;

  const where: Record<string, unknown> = {};

  if (fieldId) {
    where.fieldId = fieldId;
  }

  if (applied === "true" || applied === "false") {
    where.applied = applied === "true";
  }

  if (user.role !== "ADMIN") {
    where.field = { farm: { is: { ownerId: getUserIdNumber(user) } } };
  }

  const recommendations = await prisma.recommendation.findMany({
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
    orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
  });

  return recommendations;
});
