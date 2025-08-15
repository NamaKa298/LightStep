import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req: any, res: any) => {
  try {
    const {
      genders,
      brands,
      sizes,
      ground_types,
      minPrice,
      maxPrice,
      uses,
      stabilities,
      minDrop,
      maxDrop,
      minWeight,
      maxWeight,
      colors,
    } = req.query;

    const variantFilters: any = {};

    if (minPrice || maxPrice) {
      variantFilters.price = {};
      if (minPrice) variantFilters.price.gte = Number(minPrice);
      if (maxPrice) variantFilters.price.lte = Number(maxPrice);
    }

    if (sizes) {
      const sizeList = Array.isArray(sizes) ? sizes : [sizes];
      variantFilters.size = {
        eu_size: { in: sizeList },
      };
    }

    if (colors) {
      const colorList = Array.isArray(colors) ? colors : [colors];
      variantFilters.color = {
        name: { in: colorList },
      };
    }

    const productFilters: any = {};

    if (brands) {
      const brandList = Array.isArray(brands) ? brands : [brands];
      productFilters.brand = {
        name: { in: brandList },
      };
    }

    if (genders) {
      const genderList = Array.isArray(genders) ? genders : [genders];
      productFilters.gender = {
        name: { in: genderList },
      };
    }

    if (uses) {
      const useList = Array.isArray(uses) ? uses : [uses];
      productFilters.use = {
        name: { in: useList },
      };
    }

    if (stabilities) {
      const stabilityList = Array.isArray(stabilities)
        ? stabilities
        : [stabilities];
      productFilters.stability = { name: { in: stabilityList } };
    }

    if (minDrop || maxDrop) {
      productFilters.drop = {};
      if (minDrop) productFilters.drop.gte = Number(minDrop);
      if (maxDrop) productFilters.drop.lte = Number(maxDrop);
    }

    if (minWeight || maxWeight) {
      productFilters.weight = {};
      if (minWeight) productFilters.weight.gte = Number(minWeight);
      if (maxWeight) productFilters.weight.lte = Number(maxWeight);
    }

    if (ground_types) {
      const groundTypeList = Array.isArray(ground_types)
        ? ground_types
        : [ground_types];
      productFilters.product_ground_types = {
        some: {
          ground_type: {
            name: { in: groundTypeList },
          },
        },
      };
    }

    if (Object.keys(productFilters).length > 0) {
      variantFilters.product = productFilters;
    }

    // ...existing code...

    const variants = await prisma.productVariant.findMany({
      where: variantFilters,
      include: {
        product: {
          include: {
            brand: { select: { name: true } },
          },
        },
        color: { select: { name: true, hex_code: true } },
        size: { select: { eu_size: true } },
        product_variant_images: {
          include: {
            product_image: {
              select: {
                thumbnail_url: true,
                image_type: true,
                sort_order: true,
              },
            },
          },
        },
      },
      orderBy: [{ product_id: "asc" }, { color_id: "asc" }],
    });

    const uniqueVariants = variants.reduce((acc, variant) => {
      const key = `${variant.product_id}-${variant.color_id}`;
      if (!acc[key]) acc[key] = variant;
      return acc;
    }, {} as Record<string, any>);

    // CORRIGÉ : Query simplifiée - filtrer directement dans les données existantes
    const formattedVariants = Object.values(uniqueVariants).map(
      (variant: any) => {
        // Trouver l'image thumbnail dans les données déjà récupérées
        const thumbnailImage = variant.product_variant_images?.find(
          (vi: any) =>
            vi.product_image &&
            vi.product_image.image_type === "thumbnail" &&
            vi.product_image.sort_order === "01"
        )?.product_image;

        return {
          id: variant.id,
          sku: variant.sku,
          name: variant.product?.name,
          price: variant.price,
          stock: variant.stock,
          is_active: variant.is_active,
          rating: variant.product?.rating,
          review_count: variant.product?.review_count,
          brand: variant.product?.brand?.name,
          color: variant.color?.name,
          color_hex: variant.color?.hex_code,
          size: variant.size?.eu_size,
          thumbnail_url: thumbnailImage?.thumbnail_url || null,
        };
      }
    );

    res.json(formattedVariants);
  } catch (error) {
    console.error("Erreur lors de la récupération:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des variantes" });
  }
});

router.get("/filters", async (req, res) => {
  try {
    const [brands, sizes, groundTypes, uses, colors, genders, stabilities] =
      await Promise.all([
        prisma.brand.findMany({
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        }),
        prisma.size.findMany({
          select: { eu_size: true },
          distinct: ["eu_size"],
          orderBy: { eu_size: "asc" },
        }),
        prisma.groundType.findMany({
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        }),
        prisma.use.findMany({
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        }),
        prisma.color.findMany({
          select: { name: true, hex_code: true },
          orderBy: { name: "asc" },
        }),
        prisma.gender.findMany({
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        }),
        prisma.stability.findMany({
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        }),
      ]);

    res.json({
      brands: brands,
      sizes: sizes.map((size) => size.eu_size),
      ground_types: groundTypes,
      uses: uses,
      colors: colors.map((color) => ({
        name: color.name,
        hex_code: color.hex_code,
      })),
      genders: genders,
      stabilities: stabilities,
    });
  } catch (error) {
    console.error("Erreur lors du chargement des filtres:", error);
    res.status(500).json({ error: "Erreur lors du chargement des filtres" });
  }
});
export default router;
