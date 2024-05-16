/*
  Warnings:

  - A unique constraint covering the columns `[userId,name,identify]` on the table `contacts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "contacts_name_identify_idx";

-- CreateIndex
CREATE UNIQUE INDEX "contacts_userId_name_identify_key" ON "contacts"("userId", "name", "identify");
