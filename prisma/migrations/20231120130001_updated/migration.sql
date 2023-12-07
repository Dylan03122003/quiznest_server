/*
  Warnings:

  - You are about to drop the column `favoritedID` on the `Deck` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DeckToTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Deck" DROP CONSTRAINT "Deck_favoritedID_fkey";

-- DropForeignKey
ALTER TABLE "Deck" DROP CONSTRAINT "Deck_userID_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userID_fkey";

-- DropForeignKey
ALTER TABLE "_DeckToTag" DROP CONSTRAINT "_DeckToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_DeckToTag" DROP CONSTRAINT "_DeckToTag_B_fkey";

-- DropIndex
DROP INDEX "User_name_age_key";

-- AlterTable
ALTER TABLE "Deck" DROP COLUMN "favoritedID";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "age",
DROP COLUMN "name",
ADD COLUMN     "username" TEXT NOT NULL;

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_DeckToTag";

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;
