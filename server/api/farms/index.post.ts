import { prisma } from "~~/prisma/db";
import { Role } from "~~/shared/roles";

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event);
  const body = await readBody(event);

  if (!body.name) {
    throw createError({ statusCode: 400, message: "Farm name is required" });
  }

  const validSoilTypes = ["CLAY", "SANDY", "LOAM", "SILT", "PEAT", "CHALKY"];
  if (body.soilType && !validSoilTypes.includes(body.soilType)) {
    throw createError({ statusCode: 400, message: "Invalid soil type" });
  }

  // Admin can assign any owner; farmer is always the owner
  const ownerId = user.role === Role.ADMIN && body.ownerId != null ? Number(body.ownerId) : getUserIdNumber(user);

  if (user.role === Role.ADMIN && body.ownerId != null) {
    const owner = await prisma.user.findUnique({ where: { id: Number(body.ownerId) } });
    if (!owner) {
      throw createError({ statusCode: 400, message: "Owner not found" });
    }
  }

  const farm = await prisma.farm.create({
    data: {
      name: body.name,
      location: body.location || "",
      area: parseFloat(body.area) || 0,
      soilType: body.soilType || "LOAM",
      ownerId,
    },
    include: {
      owner: { select: { id: true, name: true, email: true } },
    },
  });

  return farm;
});
