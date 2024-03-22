/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "course" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "course_slug_key" ON "course"("slug");
