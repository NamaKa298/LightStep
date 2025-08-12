/*
  Warnings:

  - You are about to drop the column `stability` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."products" DROP COLUMN "stability",
ADD COLUMN     "stability_id" INTEGER;

-- CreateTable
CREATE TABLE "public"."stabilities" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "stabilities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_stability_id_fkey" FOREIGN KEY ("stability_id") REFERENCES "public"."stabilities"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
