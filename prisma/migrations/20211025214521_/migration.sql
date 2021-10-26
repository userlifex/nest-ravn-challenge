/*
  Warnings:

  - You are about to drop the column `type` on the `tokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "type";

-- DropEnum
DROP TYPE "TypeToken";

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
