import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = getRouterId(event);
  const body = await readBody(event);

  const field = await prisma.field.findUnique({
    where: { id },
    include: { farm: { select: { ownerId: true } } },
  });
  if (!field) {
    throw createError({ statusCode: 404, message: "Field not found" });
  }

  await requireOwnerOrAdmin(event, field.farm.ownerId);

  if (body.farmId != null) {
    const farm = await prisma.farm.findUnique({ where: { id: Number(body.farmId) } });
    if (!farm) {
      throw createError({ statusCode: 400, message: "Farm not found" });
    }
  }

  const updated = await prisma.field.update({
    where: { id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.area !== undefined && { area: parseFloat(body.area) }),
      ...(body.cropType !== undefined && { cropType: body.cropType }),
      ...(body.coordinates !== undefined && { coordinates: body.coordinates || null }),
      ...(body.farmId != null && { farmId: Number(body.farmId) }),
    },
    include: {
      farm: { select: { id: true, name: true } },
    },
  });

  return updated;
});
