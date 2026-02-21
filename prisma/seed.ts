import type { User, Farm, Field, Robot } from "../generated/prisma";
import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashSync } from "bcrypt";
import {
  USERS,
  FARMS,
  FIELDS,
  ROBOTS,
  SEASONS,
  TELEMETRY_READINGS,
  ALERTS,
  RECOMMENDATIONS,
  PLANT_ANALYSES,
} from "./constants";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function seedUsers() {
  console.log("👤 Creating users...");

  const users: User[] = [];
  for (const user of USERS) {
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        password: hashSync(user.password, 10),
        role: user.role,
      },
    });
    users.push(created);
    console.log(`  ✔ ${created.email} (${created.role})`);
  }
  return users;
}

async function seedFarms(users: User[]) {
  console.log("🏡 Creating farms...");

  const farms: Farm[] = [];
  for (const farm of FARMS) {
    const owner = users.find((u) => u.email === farm.ownerEmail);
    if (!owner) continue;

    const created = await prisma.farm.create({
      data: {
        name: farm.name,
        location: farm.location,
        area: farm.area,
        soilType: farm.soilType,
        ownerId: owner.id,
      },
    });
    farms.push(created);
    console.log(`  ✔ ${created.name}`);
  }
  return farms;
}

async function seedFields(farms: Farm[]) {
  console.log("🌾 Creating fields...");

  const fields: Field[] = [];
  for (const field of FIELDS) {
    const created = await prisma.field.create({
      data: {
        name: field.name,
        area: field.area,
        cropType: field.cropType,
        farmId: farms[field.farmIndex]!.id,
      },
    });
    fields.push(created);
    console.log(`  ✔ ${created.name}`);
  }
  return fields;
}

async function seedRobots(farms: Farm[]) {
  console.log("🤖 Creating robots...");

  const robots: Robot[] = [];
  for (const robot of ROBOTS) {
    const created = await prisma.robot.create({
      data: {
        name: robot.name,
        serialNumber: robot.serialNumber,
        status: robot.status,
        batteryLevel: robot.batteryLevel,
        firmwareVersion: robot.firmwareVersion,
        lastSeenAt: new Date(),
        farmId: farms[robot.farmIndex]!.id,
      },
    });
    robots.push(created);
    console.log(`  ✔ ${created.name} (${created.serialNumber})`);
  }
  return robots;
}

async function seedSeasons(farms: Farm[]) {
  console.log("📅 Creating seasons...");

  for (const season of SEASONS) {
    const created = await prisma.season.create({
      data: {
        name: season.name,
        year: season.year,
        cropType: season.cropType,
        status: season.status,
        startDate: season.startDate,
        endDate: season.endDate,
        farmId: farms[season.farmIndex]!.id,
      },
    });
    console.log(`  ✔ ${created.name}`);
  }
}

async function seedTelemetry(fields: Field[], robots: Robot[]) {
  console.log("📊 Creating telemetry readings...");

  for (const reading of TELEMETRY_READINGS) {
    await prisma.telemetryReading.create({
      data: {
        moisture: reading.moisture,
        ph: reading.ph,
        nitrogen: reading.nitrogen,
        phosphorus: reading.phosphorus,
        potassium: reading.potassium,
        ec: reading.ec,
        temperature: reading.temperature,
        humidity: reading.humidity,
        fieldId: fields[reading.fieldIndex]!.id,
        robotId: robots[reading.robotIndex]!.id,
      },
    });
  }
  console.log(`  ✔ ${TELEMETRY_READINGS.length} readings created`);
}

async function seedAlerts(fields: Field[]) {
  console.log("🔔 Creating alerts...");

  for (const alert of ALERTS) {
    const created = await prisma.alert.create({
      data: {
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
        status: alert.status,
        resolvedAt: alert.status === "RESOLVED" ? new Date() : null,
        fieldId: fields[alert.fieldIndex]!.id,
      },
    });
    console.log(`  ✔ ${created.title} [${created.severity}]`);
  }
}

async function seedRecommendations(fields: Field[]) {
  console.log("💡 Creating recommendations...");

  for (const rec of RECOMMENDATIONS) {
    const created = await prisma.recommendation.create({
      data: {
        title: rec.title,
        description: rec.description,
        category: rec.category,
        priority: rec.priority,
        fieldId: fields[rec.fieldIndex]!.id,
      },
    });
    console.log(`  ✔ ${created.title}`);
  }
}

async function seedPlantAnalyses(fields: Field[]) {
  console.log("🌿 Creating plant analyses...");

  for (const analysis of PLANT_ANALYSES) {
    await prisma.plantAnalysis.create({
      data: {
        imageUrl: analysis.imageUrl,
        disease: analysis.disease,
        confidence: analysis.confidence,
        healthy: analysis.healthy,
        fieldId: fields[analysis.fieldIndex]!.id,
      },
    });
  }
  console.log(`  ✔ ${PLANT_ANALYSES.length} analyses created`);
}

async function up() {
  console.log("🌱 Starting seed process...\n");

  const users = await seedUsers();
  const farms = await seedFarms(users);
  const fields = await seedFields(farms);
  const robots = await seedRobots(farms);
  await seedSeasons(farms);
  await seedTelemetry(fields, robots);
  await seedAlerts(fields);
  await seedRecommendations(fields);
  await seedPlantAnalyses(fields);

  console.log("\n✅ Seed completed successfully!");
}

async function down() {
  console.log("🧹 Cleaning database...\n");

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      "Report",
      "Recommendation",
      "Alert",
      "PlantAnalysis",
      "TelemetryReading",
      "Mission",
      "Season",
      "Robot",
      "Field",
      "Farm",
      "User"
    RESTART IDENTITY CASCADE
  `);

  console.log("✅ Database cleaned!");
}

async function main() {
  const args = process.argv.slice(2);

  try {
    if (args.includes("--down") || args.includes("-d")) {
      await down();
    } else if (args.includes("--seed-only") || args.includes("-s")) {
      await up();
    } else {
      await down();
      await up();
    }
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
