"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildImageUrl = buildImageUrl;
const client_1 = require("@prisma/client");
require("dotenv/config");
const promises_1 = __importDefault(require("fs/promises"));
const mime_types_1 = require("mime-types");
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const r2_uploader_1 = require("../utils/r2-uploader");
const IMAGE_DIR = path_1.default.join(__dirname, "../../local-images");
const prisma = new client_1.PrismaClient();
// -------------------------------- Fonction pour parser le nom de fichier -------------------------------
function parseFilename(filename) {
    const withoutExtension = filename.replace(/\.(png|jpe?g|webp)$/i, "");
    const parts = withoutExtension.split("_");
    if (parts.length < 4) {
        throw new Error(`Format de fichier invalide: ${filename}`);
    }
    const formatText = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };
    return {
        name: formatText(parts[0]),
        color: formatText(parts[1]),
        imageType: parts[2].toLowerCase(),
        sortOrder: parts[3],
    };
}
// -------------------------------- Fonction de migration --------------------------------
async function migrate() {
    try {
        const files = await promises_1.default.readdir(IMAGE_DIR);
        console.log(`Found ${files.length} files to process`);
        for (const file of files) {
            try {
                console.log(`\nProcessing file: ${file}`);
                const { name, color, imageType, sortOrder } = parseFilename(file);
                const baseModel = name.toLowerCase().replace(/[^a-z0-9]+/g, "_");
                // 1. Recherche des données avec Prisma
                const [products, colorRecord] = await Promise.all([
                    prisma.product.findMany({
                        where: { base_model: baseModel },
                        select: { id: true },
                    }),
                    prisma.color.findUnique({
                        where: { name: color },
                    }),
                ]);
                if (!products.length || !colorRecord) {
                    console.error(`❌ Données manquantes pour ${file}`);
                    continue;
                }
                // 2. Vérification si l'image existe déjà pour ce base_model
                const existingImage = await prisma.productImage.findFirst({
                    where: {
                        product_id: products[0].id, // Utilise le premier produit du base_model
                        color_id: colorRecord.id,
                        image_type: imageType,
                        original_filename: file,
                    },
                });
                if (existingImage) {
                    console.log(`⏭️ Image déjà existante pour ${file} (base_model: ${baseModel}), passage au suivant`);
                    continue;
                }
                // 3. Traitement image
                const filePath = path_1.default.join(IMAGE_DIR, file);
                const mimeType = (0, mime_types_1.lookup)(file) || "application/octet-stream";
                const timestamp = Date.now();
                const safeName = file.replace(/[^a-z0-9.-]/gi, "_");
                const imageUrls = {
                    highres: `products/highres/${timestamp}-${safeName}`,
                    lowres: `products/lowres/${timestamp}-${safeName.replace(/\.[^/.]+$/, ".webp")}`,
                    thumbnail: `products/thumnails/${timestamp}-${safeName.replace(/\.[^/.]+$/, ".webp")}`,
                };
                // Traitement Sharp
                const highresBuffer = await promises_1.default.readFile(filePath);
                const [lowresBuffer, thumbnailBuffer] = await Promise.all([
                    (0, sharp_1.default)(highresBuffer).resize(90, 113).webp({ quality: 50 }).toBuffer(),
                    (0, sharp_1.default)(highresBuffer).resize(230, 289).webp({ quality: 70 }).toBuffer(),
                ]);
                // Upload R2
                await Promise.all([
                    uploadToR2(imageUrls.highres, highresBuffer, mimeType),
                    uploadToR2(imageUrls.lowres, lowresBuffer, "image/webp"),
                    uploadToR2(imageUrls.thumbnail, thumbnailBuffer, "image/webp"),
                ]);
                // 4. Insertion avec Prisma - Une seule image par base_model
                try {
                    await prisma.productImage.create({
                        data: {
                            product_id: products[0].id, // Utilise le premier produit du base_model
                            color_id: colorRecord.id,
                            image_type: imageType,
                            sort_order: sortOrder,
                            highres_url: imageUrls.highres, // Stocke seulement le chemin relatif
                            lowres_url: imageUrls.lowres, // Stocke seulement le chemin relatif
                            thumbnail_url: imageUrls.thumbnail, // Stocke seulement le chemin relatif
                            original_filename: file,
                        },
                    });
                    console.log(`✅ Image ajoutée pour base_model ${baseModel} (${products.length} produits trouvés)`);
                }
                catch (error) {
                    console.error(`Erreur sur base_model ${baseModel}:`, error instanceof Error ? error.message : error);
                }
                console.log(`Upload réussi pour ${file}`);
                console.log("- HighRes:", imageUrls.highres);
                console.log("- LowRes:", imageUrls.lowres);
                console.log("- Thumbnail:", imageUrls.thumbnail);
            }
            catch (error) {
                console.error(`Erreur sur fichier ${file}:`, error instanceof Error ? error.message : error);
            }
        }
    }
    finally {
        await prisma.$disconnect();
    }
}
// Helper function pour R2
async function uploadToR2(key, data, contentType) {
    const uploadUrl = await (0, r2_uploader_1.generatePresignedUrl)(key);
    await fetch(uploadUrl, {
        method: "PUT",
        body: data,
        headers: { "Content-Type": contentType },
    });
}
// Fonction utilitaire pour reconstruire les URLs complètes
function buildImageUrl(relativePath) {
    return `${process.env.R2_PUBLIC_URL}/${relativePath}`;
}
// Exemple d'utilisation dans votre application :
// const fullUrl = buildImageUrl(productImage.highres_url);
// const thumbnailUrl = buildImageUrl(productImage.thumbnail_url);
migrate().catch((error) => {
    console.error("Migration error:", error);
    process.exit(1);
});
//npx ts-node src/migrations/migrate-images.ts
