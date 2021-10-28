/*
  Warnings:

  - A unique constraint covering the columns `[shop_cart_id,product_id]` on the table `items_in_cart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "items_in_cart_shop_cart_id_product_id_key" ON "items_in_cart"("shop_cart_id", "product_id");
