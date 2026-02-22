import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const id = getRouterParam(event, "id");

  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      farm: {
        select: {
          id: true,
          name: true,
          location: true,
          ownerId: true,
        },
      },
      generatedBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!report) {
    throw createError({ statusCode: 404, message: "Report not found" });
  }

  if (user.role !== "ADMIN" && report.farm.ownerId !== user.id) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }

  return report;
});
