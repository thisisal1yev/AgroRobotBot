import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.name || !body.farmId) {
    throw createError({ statusCode: 400, message: "Name and farm are required" });
  }

  const farmId = Number(body.farmId);
  const farm = await prisma.farm.findUnique({ where: { id: farmId } });
  if (!farm) {
    throw createError({ statusCode: 400, message: "Farm not found" });
  }

  await requireOwnerOrAdmin(event, farm.ownerId);

  const field = await prisma.field.create({
    data: {
      name: body.name,
      area: parseFloat(body.area) || 0,
      cropType: body.cropType || "",
      coordinates: body.coordinates || null,
      farmId,
    },
    include: {
      farm: { select: { id: true, name: true } },
    },
  });

  return field;
});
