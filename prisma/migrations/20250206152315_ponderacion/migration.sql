-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_quizzSentId_fkey";

-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_courseId_fkey";

-- AlterTable
ALTER TABLE "Activities" ADD COLUMN     "ponderacion" DECIMAL(65,30) NOT NULL DEFAULT 0.0;

-- CreateTable
CREATE TABLE "_CourseToPost" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_OptionToQuestions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AnswerToQuizzSent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CourseToPost_AB_unique" ON "_CourseToPost"("A", "B");

-- CreateIndex
CREATE INDEX "_CourseToPost_B_index" ON "_CourseToPost"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OptionToQuestions_AB_unique" ON "_OptionToQuestions"("A", "B");

-- CreateIndex
CREATE INDEX "_OptionToQuestions_B_index" ON "_OptionToQuestions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AnswerToQuizzSent_AB_unique" ON "_AnswerToQuizzSent"("A", "B");

-- CreateIndex
CREATE INDEX "_AnswerToQuizzSent_B_index" ON "_AnswerToQuizzSent"("B");

-- AddForeignKey
ALTER TABLE "_CourseToPost" ADD CONSTRAINT "_CourseToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseToPost" ADD CONSTRAINT "_CourseToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OptionToQuestions" ADD CONSTRAINT "_OptionToQuestions_A_fkey" FOREIGN KEY ("A") REFERENCES "Option"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OptionToQuestions" ADD CONSTRAINT "_OptionToQuestions_B_fkey" FOREIGN KEY ("B") REFERENCES "Questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerToQuizzSent" ADD CONSTRAINT "_AnswerToQuizzSent_A_fkey" FOREIGN KEY ("A") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerToQuizzSent" ADD CONSTRAINT "_AnswerToQuizzSent_B_fkey" FOREIGN KEY ("B") REFERENCES "QuizzSent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
