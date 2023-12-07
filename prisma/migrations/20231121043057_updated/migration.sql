-- DropForeignKey
ALTER TABLE "ClozeCard" DROP CONSTRAINT "ClozeCard_questionID_fkey";

-- DropForeignKey
ALTER TABLE "Flashcard" DROP CONSTRAINT "Flashcard_questionID_fkey";

-- DropForeignKey
ALTER TABLE "MultipleChoice" DROP CONSTRAINT "MultipleChoice_questionID_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_deckID_fkey";

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_deckID_fkey" FOREIGN KEY ("deckID") REFERENCES "Deck"("deckID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClozeCard" ADD CONSTRAINT "ClozeCard_questionID_fkey" FOREIGN KEY ("questionID") REFERENCES "Question"("questionID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_questionID_fkey" FOREIGN KEY ("questionID") REFERENCES "Question"("questionID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultipleChoice" ADD CONSTRAINT "MultipleChoice_questionID_fkey" FOREIGN KEY ("questionID") REFERENCES "Question"("questionID") ON DELETE CASCADE ON UPDATE CASCADE;
