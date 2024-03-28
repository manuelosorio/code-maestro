-- CreateTable
CREATE TABLE "db_status" (
    "initialized" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "db_status_initialized_key" ON "db_status"("initialized");
