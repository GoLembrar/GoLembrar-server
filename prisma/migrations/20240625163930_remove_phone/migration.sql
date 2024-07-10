/*
  Warnings:

  - You are about to drop the column `phone` on the `Users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Users_phone_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "phone";
