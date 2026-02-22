import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const id = getRouterId(event);

  const field = await prisma.field.findUnique({
    where: { id },
    include: {
      farm: {
        select: { id: true, name: true, ownerId: true },
      },
      telemetryReadings: {
        orderBy: { recordedAt: "desc" },
        take: 10,
      },
      alerts: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      recommendations: {
        orderBy: { priority: "asc" },
      },
      plantAnalyses: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      _count: {
        select: {
          telemetryReadings: true,
          alerts: true,
          recommendations: true,
          missions: true,
        },
      },
    },
  });

  if (!field) {
    throw createError({ statusCode: 404, message: "Field not found" });
  }

  if (user.role !== "ADMIN" && field.farm.ownerId !== getUserIdNumber(user)) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }

  return field;
});
