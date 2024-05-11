/*
  Warnings:

  - Added the required column `platform` to the `UsersToReminder` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `platform` on the `contacts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('WHATSAPP', 'TELEGRAM', 'DISCORD', 'EMAIL');

-- AlterTable
ALTER TABLE "UsersToReminder" ADD COLUMN     "platform" "Platform" NOT NULL;

-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "platform",
ADD COLUMN     "platform" "Platform" NOT NULL;

-- DropEnum
DROP TYPE "Platforms";

-- CreateIndex
CREATE INDEX "Reminders_title_idx" ON "Reminders"("title");
