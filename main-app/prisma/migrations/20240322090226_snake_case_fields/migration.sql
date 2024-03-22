/*
  Warnings:

  - You are about to drop the column `mailListId` on the `course` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "course" DROP CONSTRAINT "course_mailListId_fkey";

-- AlterTable
ALTER TABLE "course" DROP COLUMN "mailListId",
ADD COLUMN     "mail_list_id" TEXT;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_mail_list_id_fkey" FOREIGN KEY ("mail_list_id") REFERENCES "mail_list"("id") ON DELETE SET NULL ON UPDATE CASCADE;
