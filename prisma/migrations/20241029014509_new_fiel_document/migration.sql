/*
  Warnings:

  - Added the required column `document` to the `ActivitiesSent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActivitiesSent" ADD COLUMN     "document" TEXT NOT NULL;
