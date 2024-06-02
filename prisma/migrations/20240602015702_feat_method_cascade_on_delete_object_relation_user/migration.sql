-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_usersId_fkey";

-- DropForeignKey
ALTER TABLE "Reminders" DROP CONSTRAINT "Reminders_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "UsersToReminder" DROP CONSTRAINT "UsersToReminder_userId_fkey";

-- DropForeignKey
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_userId_fkey";

-- AddForeignKey
ALTER TABLE "Reminders" ADD CONSTRAINT "Reminders_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersToReminder" ADD CONSTRAINT "UsersToReminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
