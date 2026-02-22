/*
  Warnings:

  - The primary key for the `Alert` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Alert` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Farm` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Farm` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Field` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Field` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Mission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Mission` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `PlantAnalysis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `PlantAnalysis` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Recommendation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Recommendation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Report` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Report` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Robot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Robot` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Season` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Season` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `TelemetryReading` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `TelemetryReading` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `fieldId` on the `Alert` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ownerId` on the `Farm` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `farmId` on the `Field` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `robotId` on the `Mission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fieldId` on the `Mission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fieldId` on the `PlantAnalysis` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fieldId` on the `Recommendation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `farmId` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `generatedById` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `farmId` on the `Robot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `farmId` on the `Season` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `fieldId` on the `TelemetryReading` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `robotId` on the `TelemetryReading` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "Farm" DROP CONSTRAINT "Farm_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Field" DROP CONSTRAINT "Field_farmId_fkey";

-- DropForeignKey
ALTER TABLE "Mission" DROP CONSTRAINT "Mission_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "Mission" DROP CONSTRAINT "Mission_robotId_fkey";

-- DropForeignKey
ALTER TABLE "PlantAnalysis" DROP CONSTRAINT "PlantAnalysis_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "Recommendation" DROP CONSTRAINT "Recommendation_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_farmId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_generatedById_fkey";

-- DropForeignKey
ALTER TABLE "Robot" DROP CONSTRAINT "Robot_farmId_fkey";

-- DropForeignKey
ALTER TABLE "Season" DROP CONSTRAINT "Season_farmId_fkey";

-- DropForeignKey
ALTER TABLE "TelemetryReading" DROP CONSTRAINT "TelemetryReading_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "TelemetryReading" DROP CONSTRAINT "TelemetryReading_robotId_fkey";

-- AlterTable
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "fieldId",
ADD COLUMN     "fieldId" INTEGER NOT NULL,
ADD CONSTRAINT "Alert_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Farm" DROP CONSTRAINT "Farm_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "ownerId",
ADD COLUMN     "ownerId" INTEGER NOT NULL,
ADD CONSTRAINT "Farm_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Field" DROP CONSTRAINT "Field_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "farmId",
ADD COLUMN     "farmId" INTEGER NOT NULL,
ADD CONSTRAINT "Field_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Mission" DROP CONSTRAINT "Mission_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "robotId",
ADD COLUMN     "robotId" INTEGER NOT NULL,
DROP COLUMN "fieldId",
ADD COLUMN     "fieldId" INTEGER NOT NULL,
ADD CONSTRAINT "Mission_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PlantAnalysis" DROP CONSTRAINT "PlantAnalysis_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "fieldId",
ADD COLUMN     "fieldId" INTEGER NOT NULL,
ADD CONSTRAINT "PlantAnalysis_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Recommendation" DROP CONSTRAINT "Recommendation_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "fieldId",
ADD COLUMN     "fieldId" INTEGER NOT NULL,
ADD CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Report" DROP CONSTRAINT "Report_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "farmId",
ADD COLUMN     "farmId" INTEGER NOT NULL,
DROP COLUMN "generatedById",
ADD COLUMN     "generatedById" INTEGER NOT NULL,
ADD CONSTRAINT "Report_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Robot" DROP CONSTRAINT "Robot_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "farmId",
ADD COLUMN     "farmId" INTEGER NOT NULL,
ADD CONSTRAINT "Robot_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Season" DROP CONSTRAINT "Season_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "farmId",
ADD COLUMN     "farmId" INTEGER NOT NULL,
ADD CONSTRAINT "Season_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TelemetryReading" DROP CONSTRAINT "TelemetryReading_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "fieldId",
ADD COLUMN     "fieldId" INTEGER NOT NULL,
DROP COLUMN "robotId",
ADD COLUMN     "robotId" INTEGER NOT NULL,
ADD CONSTRAINT "TelemetryReading_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Farm" ADD CONSTRAINT "Farm_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Robot" ADD CONSTRAINT "Robot_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_robotId_fkey" FOREIGN KEY ("robotId") REFERENCES "Robot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelemetryReading" ADD CONSTRAINT "TelemetryReading_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelemetryReading" ADD CONSTRAINT "TelemetryReading_robotId_fkey" FOREIGN KEY ("robotId") REFERENCES "Robot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantAnalysis" ADD CONSTRAINT "PlantAnalysis_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
