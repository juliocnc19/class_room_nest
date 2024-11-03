/*
  Warnings:

  - You are about to drop the column `cap_activity` on the `ActivitiesSent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ActivitiesSent" DROP COLUMN "cap_activity",
ADD COLUMN     "selection" BOOLEAN NOT NULL DEFAULT false;
