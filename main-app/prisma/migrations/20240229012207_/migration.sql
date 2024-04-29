/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "MailList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "discription" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "MailList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "last_sent" TIMESTAMP(3),
    "subscribed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribed_at" TIMESTAMP(3),
    "user_id" TEXT,
    "mail_list_id" TEXT,

    CONSTRAINT "Subscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MailList_id_key" ON "MailList"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MailList_slug_key" ON "MailList"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_id_key" ON "Subscriber"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "MailList" ADD CONSTRAINT "MailList_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriber" ADD CONSTRAINT "Subscriber_mail_list_id_fkey" FOREIGN KEY ("mail_list_id") REFERENCES "MailList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
