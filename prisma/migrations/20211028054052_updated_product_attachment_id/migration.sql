/*
  Warnings:

  - You are about to drop the `attachment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[attachment_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "attachment" DROP CONSTRAINT "attachment_product_id_fkey";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "attachment_id" TEXT;

-- DropTable
DROP TABLE "attachment";

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_attachment_id_key" ON "products"("attachment_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "Attachment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
