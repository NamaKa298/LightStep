import { pool } from "../src/db";
import * as fs from "fs";
import * as path from "path";
import { CloudflareR2Manager, createR2ManagerFromEnv } from "../cloudflare-r2";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

/**
 * Script d'ajout de produits depuis un fichier JSON avec upload automatique des images
 * APPROCHE OPTIMISÉE : Stockage des NOMS de fichiers uniquement (pas les URLs complètes)
 *
 * UTILISATION :
 * 1. Placez vos images dans backend/temp-images/ (optionnel)
 * 2. Créez un fichier "products-to-add.json" dans ce dossier
 * 3. Configurez vos variables d'environnement R2 dans .env (optionnel)
 * 4. Exécutez : npm run add-json
 *
 * WORKFLOW OPTIMISÉ :
 * 1. Lecture du JSON avec les produits
 * 2. Pour chaque produit avec image_url :
 *    - Recherche de l'image dans temp-images/
 *    - Upload automatique vers Cloudflare R2 (si configuré)
 *    - Stockage du NOM UNIQUEMENT en base (ex: "mon-image.jpg")
 * 3. Insertion des produits en base
 * 4. Vidage du fichier JSON
 *
 * AVANTAGES :
 * - Base plus légère (noms vs URLs complètes)
 * - Flexibilité pour changer de CDN
 * - URLs reconstruites dynamiquement par l'API
 */

interface Product {
  name: string;
  price: number;
  sales_count?: number;
  is_active?: boolean;
  brand?: string;
  weight?: number;
  sizes?: number[];
  stock?: number[];
  type?: string;
  category?: string;
  gender?: string; // 'M', 'F', 'U' (Unisex)
  image_url?: string; // Nom du fichier local (sera uploadé, nom stocké en base)
  ground_types?: string;
  stability?: string;
  drop_height?: number;
  rating?: number;
  "1_star"?: number;
  "2_star"?: number;
  "3_star"?: number;
  "4_star"?: number;
  "5_star"?: number;
  review_count?: number;
  is_recommended?: number;
  color?: string;
  colors?: string;
  news?: boolean;
  sole_details?: string;
  upper?: string;
  material?: string;
  utilisation?: string;
  care_instructions?: string;
  description?: string;
}

async function addFromJSON() {
  const jsonPath = path.join(__dirname, "products-to-add.json");

  try {
    // Vérifier l'existence du fichier JSON
    if (!fs.existsSync(jsonPath)) {
      return;
    }

    // Lire et parser le fichier JSON
    const jsonContent = fs.readFileSync(jsonPath, "utf8");
    const products: Product[] = JSON.parse(jsonContent);

    if (!Array.isArray(products) || products.length === 0) {
      return;
    }

    // Initialiser le gestionnaire R2 (optionnel si images présentes)
    let r2Manager: CloudflareR2Manager | null = null;
    const tempImagesDir = path.join(process.cwd(), "temp-images");
    const hasImages = products.some((p) => p.image_url);

    if (hasImages) {
      try {
        r2Manager = createR2ManagerFromEnv();

        const isConnected = await r2Manager.testConnection();
        if (!isConnected) {
          r2Manager = null;
        }
      } catch (error: any) {
        r2Manager = null;
      }
    }

    const query = `
      INSERT INTO products (
        name, brand, price, type, category, gender, sizes, description, 
        image_url, stock, rating, review_count, color, colors, news, 
        sales_count, is_active, weight, ground_types, stability, 
        drop_height, "1_star", "2_star", "3_star", "4_star", "5_star", 
        is_recommended, sole_details, upper, material, utilisation, 
        care_instructions
      ) 
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, 
        $29, $30, $31, $32
      )
      RETURNING *;
    `;

    const addedProducts: any[] = [];
    let imagesUploaded = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`➕ Traitement ${i + 1}/${products.length}: ${product.name}`);

      // NOUVELLE APPROCHE : Stockage du nom uniquement
      let finalImageName = product.image_url || null;

      if (product.image_url && r2Manager) {
        // Si c'est déjà une URL HTTP, extraire le nom du fichier
        if (product.image_url.startsWith("http")) {
          console.log(`   🔗 URL d'image existante: ${product.image_url}`);
          finalImageName =
            product.image_url.split("/").pop() || product.image_url;
          console.log(`   📝 Extraction du nom: ${finalImageName}`);
        } else {
          // Chercher le fichier local dans temp-images/
          const localImagePath = path.join(tempImagesDir, product.image_url);

          if (fs.existsSync(localImagePath)) {
            try {
              console.log(`   📸 Upload de l'image: ${product.image_url}`);
              const remoteKey = `products/${product.image_url}`;
              const uploadedUrl = await r2Manager.uploadFile(
                localImagePath,
                remoteKey
              );
              console.log(`   ✅ Image uploadée: ${uploadedUrl}`);

              // IMPORTANT : Stocker seulement le nom, pas l'URL complète
              finalImageName = product.image_url;
              imagesUploaded++;
              console.log(
                `   📝 Stockage du nom uniquement: ${finalImageName}`
              );
            } catch (error) {
              console.log(
                `   ⚠️  Erreur upload image: ${error}. Stockage du nom local.`
              );
              finalImageName = product.image_url;
            }
          } else if (product.image_url) {
            console.log(`   ⚠️  Image non trouvée: ${localImagePath}`);
            console.log(`   📝 Stockage du nom tel quel: ${product.image_url}`);
            finalImageName = product.image_url;
          }
        }
      }

      const values = [
        // Champs obligatoires
        product.name, // $1
        product.brand || null, // $2
        product.price, // $3
        product.type || null, // $4
        product.category || null, // $5
        product.gender || null, // $6
        product.sizes || null, // $7 - array PostgreSQL
        product.description || null, // $8
        finalImageName, // $9 - NOM du fichier uniquement
        product.stock || null, // $10 - array PostgreSQL pour stock par taille
        product.rating || 0.0, // $11
        product.review_count || 0, // $12
        product.color || null, // $13
        product.colors || null, // $14
        product.news || false, // $15
        // Champs additionnels
        product.sales_count || 0, // $16
        product.is_active !== undefined ? product.is_active : true, // $17
        product.weight || null, // $18
        product.ground_types || null, // $19
        product.stability || null, // $20
        product.drop_height || null, // $21
        product["1_star"] || 0, // $22
        product["2_star"] || 0, // $23
        product["3_star"] || 0, // $24
        product["4_star"] || 0, // $25
        product["5_star"] || 0, // $26
        product.is_recommended || 0, // $27
        product.sole_details || null, // $28
        product.upper || null, // $29
        product.material || null, // $30
        product.utilisation || null, // $31
        product.care_instructions || null, // $32
      ];

      const result = await pool.query(query, values);
      const addedProduct = result.rows[0];
      addedProducts.push(addedProduct);

      console.log(`   ✅ Produit ajouté - ID: ${addedProduct.id}`);

      // Afficher le nom de fichier stocké et l'URL reconstituée
      if (finalImageName) {
        console.log(`   📝 Image stockée: ${finalImageName}`);
        const fullUrl = `${process.env.R2_PUBLIC_URL}/products/${finalImageName}`;
        console.log(`   🔗 URL de reconstruction: ${fullUrl}`);
      }
      console.log("");
    }

    // Vider le fichier après ajout réussi
    fs.writeFileSync(jsonPath, "[]", "utf8");
    console.log("🧹 Fichier JSON vidé après ajout.");

    console.log("📋 Tous les produits ont été ajoutés avec succès !");

    // Résumé optimisé
    const totalImagesInInput = products.filter((p) => p.image_url).length;

    if (totalImagesInInput > 0) {
      console.log(`\n📸 Images traitées : ${totalImagesInInput} au total`);
      console.log(
        `   • Toutes stockées comme NOMS de fichiers (approche optimisée)`
      );

      if (r2Manager && imagesUploaded > 0) {
        console.log(`   • ${imagesUploaded} uploadées vers R2 avec succès`);
        console.log("\n🎯 Avantages de cette approche :");
        console.log("✅ Base de données plus légère (noms vs URLs complètes)");
        console.log("✅ Flexibilité pour changer de CDN");
        console.log("✅ URLs reconstruites dynamiquement par l'API");
        console.log("\n💡 URLs de reconstruction :");
        console.log(`   Base URL: ${process.env.R2_PUBLIC_URL}/products/`);
        console.log(
          "   Exemple: 'image.jpg' → 'https://cdn.../products/image.jpg'"
        );
        console.log("\n🧹 Prochaines étapes :");
        console.log("1. Vérifiez que vos images sont accessibles");
        console.log("2. Nettoyez temp-images/ avec : npm run clean-images");
      } else {
        console.log(`   • Stockées comme noms de fichiers (R2 non configuré)`);
        console.log("\n💡 Pour activer l'upload automatique :");
        console.log("   - Configurez vos variables R2 dans .env");
        console.log("   - Placez vos images dans temp-images/");
      }
    }

    console.log("\n💡 Vérifiez les données avec : npm run show-table");
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout des produits :", error);
    if (
      error instanceof Error &&
      error.message.includes("Variables d'environnement manquantes")
    ) {
      console.log(
        "\n🔧 Configuration R2 optionnelle. Pour activer l'upload automatique :"
      );
      console.log("R2_ACCOUNT_ID=votre_account_id");
      console.log("R2_ACCESS_KEY_ID=votre_access_key");
      console.log("R2_SECRET_ACCESS_KEY=votre_secret_key");
      console.log("R2_BUCKET_NAME=votre_bucket_name");
    }
    console.log(
      "💡 Vérifiez le format de votre fichier JSON et la connexion à la base de données."
    );
  } finally {
    await pool.end();
  }
}

addFromJSON();
