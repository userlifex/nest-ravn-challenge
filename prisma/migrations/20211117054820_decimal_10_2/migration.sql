-- AlterTable
ALTER TABLE "items_ordered" ALTER COLUMN "sell_price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "sub_total" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "total" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);
