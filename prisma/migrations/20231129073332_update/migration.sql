-- CreateIndex
CREATE INDEX "Deck_deckID_parentDeckID_idx" ON "Deck"("deckID", "parentDeckID");
