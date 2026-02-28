import { prisma } from "~~/prisma/db";
import { Role } from "~~/shared/roles";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);

  const where = user.role === Role.ADMIN ? {} : { ownerId: getUserIdNumber(user) };

  const farms = await prisma.farm.findMany({
    where,
    include: {
      owner: { select: { id: true, name: true, email: true } },
      _count: { select: { fields: true, robots: true, seasons: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return farms;
});
