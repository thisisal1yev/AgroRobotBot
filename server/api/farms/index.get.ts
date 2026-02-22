import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);

  const where = user.role === "ADMIN" ? {} : { ownerId: Number(user.id) };

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
