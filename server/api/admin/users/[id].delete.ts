import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const id = getRouterId(event);

  await prisma.user.delete({ where: { id } });

  return { success: true };
});
