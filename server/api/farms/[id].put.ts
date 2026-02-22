import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  const farm = await prisma.farm.findUnique({ where: { id } });
  if (!farm) {
    throw createError({ statusCode: 404, message: "Farm not found" });
  }

  const user = await requireOwnerOrAdmin(event, farm.ownerId);

  const validSoilTypes = ["CLAY", "SANDY", "LOAM", "SILT", "PEAT", "CHALKY"];
  if (body.soilType && !validSoilTypes.includes(body.soilType)) {
    throw createError({ statusCode: 400, message: "Invalid soil type" });
  }

  if (body.ownerId && user.role === "ADMIN") {
    const owner = await prisma.user.findUnique({ where: { id: body.ownerId } });
    if (!owner) {
      throw createError({ statusCode: 400, message: "Owner not found" });
    }
  }

  const updated = await prisma.farm.update({
    where: { id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.location !== undefined && { location: body.location }),
      ...(body.area !== undefined && { area: parseFloat(body.area) }),
      ...(body.soilType && { soilType: body.soilType }),
      ...(body.ownerId && user.role === "ADMIN" && { ownerId: body.ownerId }),
    },
    include: {
      owner: { select: { id: true, name: true, email: true } },
    },
  });

  return updated;
});
