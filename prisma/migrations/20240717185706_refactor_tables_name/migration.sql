/*
  Warnings:

  - You are about to drop the column `platform` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Emails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reminders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UsersToReminder` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `channel` to the `contacts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Channel" AS ENUM ('WHATSAPP', 'TELEGRAM', 'DISCORD', 'EMAIL');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_usersId_fkey";

-- DropForeignKey
ALTER TABLE "Emails" DROP CONSTRAINT "Emails_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Reminders" DROP CONSTRAINT "Reminders_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Reminders" DROP CONSTRAINT "Reminders_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "UsersToReminder" DROP CONSTRAINT "UsersToReminder_reminderId_fkey";

-- DropForeignKey
ALTER TABLE "UsersToReminder" DROP CONSTRAINT "UsersToReminder_userId_fkey";

-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_userId_fkey";

-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "platform",
ADD COLUMN     "channel" "Channel" NOT NULL;

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Emails";

-- DropTable
DROP TABLE "Reminders";

-- DropTable
DROP TABLE "Users";

-- DropTable
DROP TABLE "UsersToReminder";

-- DropEnum
DROP TYPE "EmailStatus";

-- DropEnum
DROP TYPE "Platform";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "name" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "description" VARCHAR(512) NOT NULL,
    "scheduled" TIMESTAMP(3) NOT NULL,
    "isActivated" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_to_reminders" (
    "id" SERIAL NOT NULL,
    "reminderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contactId" TEXT NOT NULL,

    CONSTRAINT "users_to_reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emails" (
    "id" SERIAL NOT NULL,
    "ownerId" TEXT NOT NULL,
    "from" VARCHAR(128) NOT NULL,
    "to" VARCHAR(128) NOT NULL,
    "subject" VARCHAR(200),
    "html" TEXT,
    "scheduled" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "emails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "reminders_title_idx" ON "reminders"("title");

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_to_reminders" ADD CONSTRAINT "users_to_reminders_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_to_reminders" ADD CONSTRAINT "users_to_reminders_reminderId_fkey" FOREIGN KEY ("reminderId") REFERENCES "reminders"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emails" ADD CONSTRAINT "emails_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
