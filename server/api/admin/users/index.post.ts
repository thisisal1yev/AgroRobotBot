import { hashSync } from "bcrypt";
import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);
  const body = await readBody(event);

  if (!body.email || !body.password) {
    throw createError({ statusCode: 400, message: "Email and password are required" });
  }

  if (body.password.length < 6) {
    throw createError({ statusCode: 400, message: "Password must be at least 6 characters" });
  }

  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) {
    throw createError({ statusCode: 400, message: "A user with this email already exists" });
  }

  if (body.role && !["FARMER", "ADMIN"].includes(body.role)) {
    throw createError({ statusCode: 400, message: "Role must be FARMER or ADMIN" });
  }

  const password = hashSync(body.password, 10);

  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name || null,
      password,
      role: body.role || "FARMER",
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return user;
});
