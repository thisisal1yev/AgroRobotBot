import { prisma } from "~~/prisma/db";
import type { SafeUserWithRelations } from "../../../utils/sanitize";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = getRouterId(event);

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      farms: {
        select: {
          id: true,
          name: true,
          location: true,
          area: true,
          soilType: true,
          createdAt: true,
          _count: { select: { fields: true, robots: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      reports: {
        select: {
          id: true,
          title: true,
          type: true,
          fileUrl: true,
          generatedAt: true,
        },
        orderBy: { generatedAt: "desc" },
        take: 10,
      },
      _count: {
        select: { farms: true, reports: true },
      },
    },
  });

  if (!user) {
    throw createError({ statusCode: 404, message: "User not found" });
  }

  return user as unknown as SafeUserWithRelations;
});
