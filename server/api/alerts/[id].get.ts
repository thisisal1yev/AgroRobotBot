import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const id = getRouterId(event);

  const alert = await prisma.alert.findUnique({
    where: { id },
    include: {
      field: {
        select: {
          id: true,
          name: true,
          farm: { select: { id: true, name: true, ownerId: true } },
        },
      },
    },
  });

  if (!alert) {
    throw createError({ statusCode: 404, message: "Alert not found" });
  }

  if (user.role !== "ADMIN" && alert.field?.farm?.ownerId !== Number(user.id)) {
    throw createError({ statusCode: 403, message: "Access denied" });
  }

  return alert;
});
