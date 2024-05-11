-- CreateEnum
CREATE TYPE "Platforms" AS ENUM ('WHATSAPP', 'TELEGRAM', 'EMAIL', 'DISCORD');

-- CreateTable
CREATE TABLE "contacts" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "identify" VARCHAR(64) NOT NULL,
    "platform" "Platforms" NOT NULL,
    "usersId" INTEGER NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "contacts_name_identify_idx" ON "contacts"("name", "identify");

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
