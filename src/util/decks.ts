import { prisma } from './prisma_client.js'

export async function getAllChildDeckIds(deckId: string): Promise<string[]> {
  const result = await prisma.deck.findUnique({
    where: { deckID: deckId },
    include: {
      childDecks: { select: { deckID: true } },
    },
  })

  if (!result) {
    return []
  }

  const childDeckIds = result.childDecks.map((childDeck) => childDeck.deckID)

  // Recursively fetch child deck IDs for each child deck
  const nestedChildDeckIds = await Promise.all(
    childDeckIds.map((childDeckId) => getAllChildDeckIds(childDeckId)),
  )

  return childDeckIds.concat(...nestedChildDeckIds)
}
