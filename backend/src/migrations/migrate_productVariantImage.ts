import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function migrateProductVariantImage() {
  try {
    const variants = await prisma.productVariant.findMany({
      include: {
        product: {
          select: {
            id: true,
            base_model: true,
            name: true,
          },
        },
      },
    });

    for (const variant of variants) {
      try {
        const existingAssociations = await prisma.productVariantImage.findMany({
          where: { product_variant_id: variant.id },
        });

        if (existingAssociations.length > 0) {
          continue;
        }

        const matchingImages = await prisma.productImage.findMany({
          where: {
            color_id: variant.color_id ? variant.color_id : undefined,
            product: {
              base_model: variant.product?.base_model,
            },
          },
        });

        if (matchingImages.length === 0) {
          continue;
        }

        const associations = matchingImages.map((images) => ({
          product_variant_id: variant.id,
          product_image_id: images.id,
        }));

        await prisma.productVariantImage.createMany({
          data: associations,
          skipDuplicates: true,
        });
      } catch (error) {
        console.error(
          `❌ Erreur sur variante ${variant.sku}:`,
          error instanceof Error ? error.message : error
        );
      }
    }
  } catch (error) {
    console.error("💥 Erreur générale de migration:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateProductVariantImage().catch((error) => {
  console.error("Migration error:", error);
  process.exit(1);
});
