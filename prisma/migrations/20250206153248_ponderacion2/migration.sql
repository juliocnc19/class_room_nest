/*
  Warnings:

  - You are about to drop the `_AnswerToQuizzSent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_OptionToQuestions` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `quizzId` on table `Questions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "_AnswerToQuizzSent" DROP CONSTRAINT "_AnswerToQuizzSent_A_fkey";

-- DropForeignKey
ALTER TABLE "_AnswerToQuizzSent" DROP CONSTRAINT "_AnswerToQuizzSent_B_fkey";

-- DropForeignKey
ALTER TABLE "_OptionToQuestions" DROP CONSTRAINT "_OptionToQuestions_A_fkey";

-- DropForeignKey
ALTER TABLE "_OptionToQuestions" DROP CONSTRAINT "_OptionToQuestions_B_fkey";

-- AlterTable
ALTER TABLE "Questions" ALTER COLUMN "quizzId" SET NOT NULL;

-- DropTable
DROP TABLE "_AnswerToQuizzSent";

-- DropTable
DROP TABLE "_OptionToQuestions";

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_quizzSentId_fkey" FOREIGN KEY ("quizzSentId") REFERENCES "QuizzSent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
