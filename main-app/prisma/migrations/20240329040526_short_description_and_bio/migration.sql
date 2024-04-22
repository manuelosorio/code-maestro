-- AlterTable
ALTER TABLE "course" ADD COLUMN     "short_description" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "bio" TEXT;
