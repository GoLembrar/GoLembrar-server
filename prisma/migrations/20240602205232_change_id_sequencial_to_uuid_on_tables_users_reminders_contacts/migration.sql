/*
  Warnings:

  - The primary key for the `Reminders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `contacts` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_usersId_fkey";

-- DropForeignKey
ALTER TABLE "Reminders" DROP CONSTRAINT "Reminders_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "UsersToReminder" DROP CONSTRAINT "UsersToReminder_reminderId_fkey";

-- DropForeignKey
ALTER TABLE "UsersToReminder" DROP CONSTRAINT "UsersToReminder_userId_fkey";

-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_userId_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "usersId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Reminders" DROP CONSTRAINT "Reminders_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "ownerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Reminders_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Reminders_id_seq";

-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Users_id_seq";

-- AlterTable
ALTER TABLE "UsersToReminder" ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "reminderId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "contacts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "contacts_id_seq";

-- AddForeignKey
ALTER TABLE "Reminders" ADD CONSTRAINT "Reminders_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersToReminder" ADD CONSTRAINT "UsersToReminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersToReminder" ADD CONSTRAINT "UsersToReminder_reminderId_fkey" FOREIGN KEY ("reminderId") REFERENCES "Reminders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
