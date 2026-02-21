import { prisma } from "~~/prisma/db";

export default defineEventHandler(async (event) => {
  await requireAdmin(event);

  const [users, farms, fields, robots, alerts, missions, readings] =
    await Promise.all([
      prisma.user.count(),
      prisma.farm.count(),
      prisma.field.count(),
      prisma.robot.count(),
      prisma.alert.count({ where: { status: "ACTIVE" } }),
      prisma.mission.count({ where: { status: "IN_PROGRESS" } }),
      prisma.telemetryReading.count(),
    ]);

  return {
    users,
    farms,
    fields,
    robots,
    activeAlerts: alerts,
    activeMissions: missions,
    totalReadings: readings,
  };
});
