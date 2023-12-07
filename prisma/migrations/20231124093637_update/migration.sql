/*
  Warnings:

  - You are about to drop the column `answer` on the `MultipleChoice` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MultipleChoice" DROP COLUMN "answer",
ADD COLUMN     "answers" TEXT[];
