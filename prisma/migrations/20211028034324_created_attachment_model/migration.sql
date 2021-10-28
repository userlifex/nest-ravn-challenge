/*
  Warnings:

  - You are about to drop the column `image_url` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "image_url";

-- CreateTable
CREATE TABLE "attachment" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attachment_product_id_key" ON "attachment"("product_id");

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
