-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('CLOZE_CARD', 'FLASHCARD', 'MULTIPLE_CHOICE');

-- AlterTable
ALTER TABLE "Deck" ADD COLUMN     "parentDeckID" TEXT;

-- CreateTable
CREATE TABLE "Question" (
    "questionID" TEXT NOT NULL,
    "deckID" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "explanation" TEXT,
    "revisedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("questionID")
);

-- CreateTable
CREATE TABLE "ClozeCard" (
    "clozeCardID" TEXT NOT NULL,
    "questionID" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "answers" TEXT[],

    CONSTRAINT "ClozeCard_pkey" PRIMARY KEY ("clozeCardID")
);

-- CreateTable
CREATE TABLE "Flashcard" (
    "flashcardID" TEXT NOT NULL,
    "questionID" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "back" TEXT NOT NULL,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("flashcardID")
);

-- CreateTable
CREATE TABLE "MultipleChoice" (
    "multipleChoiceID" TEXT NOT NULL,
    "questionID" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "choices" TEXT[],
    "answer" TEXT NOT NULL,

    CONSTRAINT "MultipleChoice_pkey" PRIMARY KEY ("multipleChoiceID")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClozeCard_questionID_key" ON "ClozeCard"("questionID");

-- CreateIndex
CREATE UNIQUE INDEX "Flashcard_questionID_key" ON "Flashcard"("questionID");

-- CreateIndex
CREATE UNIQUE INDEX "MultipleChoice_questionID_key" ON "MultipleChoice"("questionID");

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_parentDeckID_fkey" FOREIGN KEY ("parentDeckID") REFERENCES "Deck"("deckID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_deckID_fkey" FOREIGN KEY ("deckID") REFERENCES "Deck"("deckID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClozeCard" ADD CONSTRAINT "ClozeCard_questionID_fkey" FOREIGN KEY ("questionID") REFERENCES "Question"("questionID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_questionID_fkey" FOREIGN KEY ("questionID") REFERENCES "Question"("questionID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultipleChoice" ADD CONSTRAINT "MultipleChoice_questionID_fkey" FOREIGN KEY ("questionID") REFERENCES "Question"("questionID") ON DELETE RESTRICT ON UPDATE CASCADE;
