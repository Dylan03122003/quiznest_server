/*
  Warnings:

  - You are about to drop the column `explanation` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Flashcard" ADD COLUMN     "explanation" TEXT;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "explanation";
