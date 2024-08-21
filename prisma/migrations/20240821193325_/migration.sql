-- DropForeignKey
ALTER TABLE "users_to_reminders" DROP CONSTRAINT "users_to_reminders_contactId_fkey";

-- AddForeignKey
ALTER TABLE "users_to_reminders" ADD CONSTRAINT "users_to_reminders_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
