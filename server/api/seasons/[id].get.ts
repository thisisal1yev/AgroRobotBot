import { prisma } from "~~/prisma/db";
import { Role } from "~~/shared/roles";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const id = getRouterId(event);

  const season = await prisma.season.findUnique({
    where: { id },
    include: {
      farm: { select: { id: true, name: true, ownerId: true } },
    },
  });

  if (!season) {
    throw createError({ statusCode: 404, message: "Season not found" });
  }

  if (user.role !== Role.ADMIN && season.farm.ownerId !== getUserIdNumber(user)) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }

  return season;
});
