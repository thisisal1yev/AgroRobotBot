import { compare } from "bcrypt";
import { prisma } from "~~/prisma/db";
import { sanitizeUser } from "~~/server/utils/sanitize";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      message: "Email and password are required",
    });
  }

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Invalid credentials",
    });
  }

  const validPassword = await compare(body.password, user.password);

  if (!validPassword) {
    throw createError({
      statusCode: 401,
      message: "Invalid credentials",
    });
  }

  await setUserSession(event, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });

  return sanitizeUser(user);
});
