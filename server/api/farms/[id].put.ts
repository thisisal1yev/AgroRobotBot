import { prisma } from "~~/prisma/db";
import { Role } from "~~/shared/roles";

export default defineEventHandler(async (event) => {
  const id = getRouterId(event);
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

  if (body.ownerId != null && user.role === Role.ADMIN) {
    const ownerId = Number(body.ownerId);
    const owner = await prisma.user.findUnique({ where: { id: ownerId } });
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
      ...(body.ownerId != null && user.role === Role.ADMIN && { ownerId: Number(body.ownerId) }),
    },
    include: {
      owner: { select: { id: true, name: true, email: true } },
    },
  });

  return updated;
});
