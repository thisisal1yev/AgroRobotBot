import { hashSync } from "bcrypt";
import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.email || !body.password || !body.name) {
    throw createError({
      statusCode: 400,
      message: "Email, password and name are required",
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: "User already exists",
    });
  }

  const password = hashSync(body.password, 10);

  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      password,
    },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
});
