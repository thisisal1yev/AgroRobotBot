import { prisma } from "~~/prisma/db";
import { sanitizeUser } from "~~/server/utils/sanitize";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  if (!session.user) {
    throw createError({
      statusCode: 401,
      message: "Not authenticated",
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "User not found",
    });
  }

  return sanitizeUser(user);
});
