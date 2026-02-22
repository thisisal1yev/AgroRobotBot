import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const id = getRouterId(event);
  const body = await readBody(event);

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    throw createError({ statusCode: 404, message: "User not found" });
  }

  if (body.email && body.email !== existing.email) {
    const emailTaken = await prisma.user.findUnique({ where: { email: body.email } });
    if (emailTaken) {
      throw createError({ statusCode: 400, message: "A user with this email already exists" });
    }
  }

  if (body.role && !["FARMER", "ADMIN"].includes(body.role)) {
    throw createError({ statusCode: 400, message: "Role must be FARMER or ADMIN" });
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(body.email && { email: body.email }),
      ...(body.name !== undefined && { name: body.name || null }),
      ...(body.role && { role: body.role }),
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return user;
});
