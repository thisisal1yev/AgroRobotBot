import { prisma } from "~~/prisma/db";
import { Role } from "~~/shared/roles";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const id = getRouterId(event);

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

  if (user.role !== Role.ADMIN && report.farm.ownerId !== getUserIdNumber(user)) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }

  return report;
});
