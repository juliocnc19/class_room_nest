/*
  Warnings:

  - You are about to alter the column `ponderacion` on the `Activities` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Activities" ALTER COLUMN "ponderacion" SET DEFAULT 0,
ALTER COLUMN "ponderacion" SET DATA TYPE INTEGER;
