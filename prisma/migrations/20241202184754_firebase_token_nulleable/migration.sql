-- AlterTable
ALTER TABLE "User" ALTER COLUMN "firebaseToken" DROP NOT NULL,
ALTER COLUMN "firebaseToken" DROP DEFAULT;
