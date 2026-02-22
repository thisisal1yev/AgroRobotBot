import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  const robot = await prisma.robot.findUnique({
    where: { id },
    include: { farm: { select: { ownerId: true } } },
  });
  if (!robot) {
    throw createError({ statusCode: 404, message: "Robot not found" });
  }

  await requireOwnerOrAdmin(event, robot.farm.ownerId);

  if (body.serialNumber && body.serialNumber !== robot.serialNumber) {
    const existingSerial = await prisma.robot.findUnique({ where: { serialNumber: body.serialNumber } });
    if (existingSerial) {
      throw createError({ statusCode: 400, message: "A robot with this serial number already exists" });
    }
  }

  const validStatuses = ["ONLINE", "OFFLINE", "CHARGING", "IN_MISSION"];
  if (body.status && !validStatuses.includes(body.status)) {
    throw createError({ statusCode: 400, message: "Invalid robot status" });
  }

  const updated = await prisma.robot.update({
    where: { id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.serialNumber && { serialNumber: body.serialNumber }),
      ...(body.status && { status: body.status }),
      ...(body.batteryLevel !== undefined && { batteryLevel: parseInt(body.batteryLevel) }),
      ...(body.firmwareVersion !== undefined && { firmwareVersion: body.firmwareVersion }),
      ...(body.farmId && { farmId: body.farmId }),
    },
    include: {
      farm: { select: { id: true, name: true } },
    },
  });

  return updated;
});
