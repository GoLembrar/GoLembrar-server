/*
  Warnings:

  - You are about to drop the column `usersId` on the `contacts` table. All the data in the column will be lost.
  - Added the required column `userId` to the `contacts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_usersId_fkey";

-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "usersId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
