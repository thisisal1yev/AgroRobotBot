import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.name || !body.serialNumber || !body.farmId) {
    throw createError({ statusCode: 400, message: "Name, serial number, and farm are required" });
  }

  const farmId = Number(body.farmId);
  const farm = await prisma.farm.findUnique({ where: { id: farmId } });
  if (!farm) {
    throw createError({ statusCode: 400, message: "Farm not found" });
  }

  await requireOwnerOrAdmin(event, farm.ownerId);

  const existingSerial = await prisma.robot.findUnique({ where: { serialNumber: body.serialNumber } });
  if (existingSerial) {
    throw createError({ statusCode: 400, message: "A robot with this serial number already exists" });
  }

  const validStatuses = ["ONLINE", "OFFLINE", "CHARGING", "IN_MISSION"];
  if (body.status && !validStatuses.includes(body.status)) {
    throw createError({ statusCode: 400, message: "Invalid robot status" });
  }

  const robot = await prisma.robot.create({
    data: {
      name: body.name,
      serialNumber: body.serialNumber,
      status: body.status || "OFFLINE",
      batteryLevel: parseInt(body.batteryLevel) || 100,
      firmwareVersion: body.firmwareVersion || "1.0.0",
      farmId,
    },
    include: {
      farm: { select: { id: true, name: true } },
    },
  });

  return robot;
});
