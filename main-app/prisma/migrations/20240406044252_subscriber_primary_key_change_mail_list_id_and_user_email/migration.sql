/*
  Warnings:

  - The primary key for the `subscriber` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "subscriber" DROP CONSTRAINT "subscriber_pkey",
ADD CONSTRAINT "subscriber_pkey" PRIMARY KEY ("mail_list_id", "email");
