import { prisma } from "~~/prisma/db";
import { Role } from "~~/shared/roles";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const { id } = getRouterParams(event);
  const analysisId = Number(id);

  if (Number.isNaN(analysisId)) {
    throw createError({
      statusCode: 400,
      message: "Invalid analysis ID",
    });
  }

  const analysis = await prisma.plantAnalysis.findFirst({
    where: {
      id: analysisId,
      ...(user.role !== Role.ADMIN
        ? { field: { farm: { ownerId: getUserIdNumber(user) } } }
        : {}),
    },
    include: {
      field: {
        select: {
          id: true,
          name: true,
          farm: { select: { id: true, name: true } },
        },
      },
    },
  });

  if (!analysis) {
    throw createError({
      statusCode: 404,
      message: "Plant analysis not found",
    });
  }

  return analysis;
});
