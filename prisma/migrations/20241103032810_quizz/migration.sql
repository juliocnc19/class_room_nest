/*
  Warnings:

  - You are about to drop the column `selection` on the `ActivitiesSent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ActivitiesSent" DROP COLUMN "selection";

-- CreateTable
CREATE TABLE "Quizz" (
    "id" SERIAL NOT NULL,
    "activity_id" INTEGER NOT NULL,

    CONSTRAINT "Quizz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Questions" (
    "id" SERIAL NOT NULL,
    "quizzId" INTEGER,
    "text" TEXT NOT NULL,
    "answer" INTEGER NOT NULL,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizzSent" (
    "id" SERIAL NOT NULL,
    "quizzId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizzSent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Quizz" ADD CONSTRAINT "Quizz_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "Activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_quizzId_fkey" FOREIGN KEY ("quizzId") REFERENCES "Quizz"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizzSent" ADD CONSTRAINT "QuizzSent_quizzId_fkey" FOREIGN KEY ("quizzId") REFERENCES "Quizz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizzSent" ADD CONSTRAINT "QuizzSent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
