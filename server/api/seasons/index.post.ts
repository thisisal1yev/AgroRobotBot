import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.name || !body.farmId) {
    throw createError({ statusCode: 400, message: "Name and farm are required" });
  }

  const farm = await prisma.farm.findUnique({ where: { id: body.farmId } });
  if (!farm) {
    throw createError({ statusCode: 400, message: "Farm not found" });
  }

  await requireOwnerOrAdmin(event, farm.ownerId);

  const validStatuses = ["PLANNED", "ACTIVE", "COMPLETED"];
  if (body.status && !validStatuses.includes(body.status)) {
    throw createError({ statusCode: 400, message: "Invalid season status" });
  }

  const season = await prisma.season.create({
    data: {
      name: body.name,
      year: parseInt(body.year) || new Date().getFullYear(),
      cropType: body.cropType || "",
      status: body.status || "PLANNED",
      startDate: new Date(body.startDate || Date.now()),
      endDate: body.endDate ? new Date(body.endDate) : null,
      farmId: body.farmId,
    },
    include: {
      farm: { select: { id: true, name: true } },
    },
  });

  return season;
});
