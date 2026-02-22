import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = getRouterId(event);
  const body = await readBody(event);

  const season = await prisma.season.findUnique({
    where: { id },
    include: { farm: { select: { ownerId: true } } },
  });
  if (!season) {
    throw createError({ statusCode: 404, message: "Season not found" });
  }

  await requireOwnerOrAdmin(event, season.farm.ownerId);

  const validStatuses = ["PLANNED", "ACTIVE", "COMPLETED"];
  if (body.status && !validStatuses.includes(body.status)) {
    throw createError({ statusCode: 400, message: "Invalid season status" });
  }

  const updated = await prisma.season.update({
    where: { id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.year !== undefined && { year: parseInt(body.year) }),
      ...(body.cropType !== undefined && { cropType: body.cropType }),
      ...(body.status && { status: body.status }),
      ...(body.startDate && { startDate: new Date(body.startDate) }),
      ...(body.endDate !== undefined && { endDate: body.endDate ? new Date(body.endDate) : null }),
      ...(body.farmId != null && { farmId: Number(body.farmId) }),
    },
    include: {
      farm: { select: { id: true, name: true } },
    },
  });

  return updated;
});
