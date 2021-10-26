/*
  Warnings:

  - You are about to drop the column `productId` on the `items_in_cart` table. All the data in the column will be lost.
  - You are about to drop the column `shopCartId` on the `items_in_cart` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `items_ordered` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `items_ordered` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `shop_carts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customer_id]` on the table `shop_carts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_id` to the `items_in_cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shop_cart_id` to the `items_in_cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `items_ordered` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `items_ordered` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_id` to the `shop_carts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "items_in_cart" DROP CONSTRAINT "items_in_cart_productId_fkey";

-- DropForeignKey
ALTER TABLE "items_in_cart" DROP CONSTRAINT "items_in_cart_shopCartId_fkey";

-- DropForeignKey
ALTER TABLE "items_ordered" DROP CONSTRAINT "items_ordered_orderId_fkey";

-- DropForeignKey
ALTER TABLE "items_ordered" DROP CONSTRAINT "items_ordered_productId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_customerId_fkey";

-- DropForeignKey
ALTER TABLE "shop_carts" DROP CONSTRAINT "shop_carts_customerId_fkey";

-- DropIndex
DROP INDEX "shop_carts_customerId_key";

-- AlterTable
ALTER TABLE "items_in_cart" DROP COLUMN "productId",
DROP COLUMN "shopCartId",
ADD COLUMN     "product_id" TEXT NOT NULL,
ADD COLUMN     "shop_cart_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "items_ordered" DROP COLUMN "orderId",
DROP COLUMN "productId",
ADD COLUMN     "order_id" TEXT NOT NULL,
ADD COLUMN     "product_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "customerId",
ADD COLUMN     "customer_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "shop_carts" DROP COLUMN "customerId",
ADD COLUMN     "customer_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "shop_carts_customer_id_key" ON "shop_carts"("customer_id");

-- AddForeignKey
ALTER TABLE "shop_carts" ADD CONSTRAINT "shop_carts_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_in_cart" ADD CONSTRAINT "items_in_cart_shop_cart_id_fkey" FOREIGN KEY ("shop_cart_id") REFERENCES "shop_carts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_in_cart" ADD CONSTRAINT "items_in_cart_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_ordered" ADD CONSTRAINT "items_ordered_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_ordered" ADD CONSTRAINT "items_ordered_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
