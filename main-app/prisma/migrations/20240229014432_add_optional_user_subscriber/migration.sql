/*
  Warnings:

  - Made the column `mail_list_id` on table `Subscriber` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Subscriber" DROP CONSTRAINT "Subscriber_mail_list_id_fkey";

-- AlterTable
ALTER TABLE "Subscriber" ALTER COLUMN "mail_list_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Subscriber" ADD CONSTRAINT "Subscriber_mail_list_id_fkey" FOREIGN KEY ("mail_list_id") REFERENCES "MailList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriber" ADD CONSTRAINT "Subscriber_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
