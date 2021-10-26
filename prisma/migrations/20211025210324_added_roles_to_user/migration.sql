/*
  Warnings:

  - You are about to drop the column `type` on the `tokens` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('customer', 'moderator');

-- AlterTable
ALTER TABLE "tokens" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "roles" "Roles" NOT NULL DEFAULT E'customer';

-- DropEnum
DROP TYPE "TypeToken";
