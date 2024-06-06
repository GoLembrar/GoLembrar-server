-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "Emails" (
    "id" SERIAL NOT NULL,
    "ownerId" TEXT NOT NULL,
    "from" VARCHAR(128) NOT NULL,
    "to" VARCHAR(128) NOT NULL,
    "subject" VARCHAR(200) NOT NULL,
    "html" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Emails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Emails" ADD CONSTRAINT "Emails_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
