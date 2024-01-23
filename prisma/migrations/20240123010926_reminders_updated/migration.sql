/*
  Warnings:

  - Added the required column `description` to the `Reminders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform` to the `Reminders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduled` to the `Reminders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Reminders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reminders" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "isActivated" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "platform" VARCHAR(12) NOT NULL,
ADD COLUMN     "scheduled" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "title" VARCHAR(128) NOT NULL;
