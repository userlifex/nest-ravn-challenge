/*
  Warnings:

  - A unique constraint covering the columns `[last_like_user_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "last_like_user_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "products_last_like_user_id_key" ON "products"("last_like_user_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_last_like_user_id_fkey" FOREIGN KEY ("last_like_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
