import {
  CloudflareR2Manager,
  createR2ManagerFromEnv,
} from "../src/cloudflare-r2";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();

const TEMP_IMAGES_DIR = path.join(process.cwd(), "temp-images");

async function uploadAllImages() {
  try {
    console.log("🚀 Script d'upload des images vers Cloudflare R2");
    console.log("================================================");

    // Vérification du dossier temp-images
    if (!fs.existsSync(TEMP_IMAGES_DIR)) {
      console.log(`📁 Création du dossier: ${TEMP_IMAGES_DIR}`);
      fs.mkdirSync(TEMP_IMAGES_DIR, { recursive: true });
      console.log(
        "ℹ️ Dossier temp-images vide. Placez vos images dedans et relancez le script."
      );
      return;
    }

    // Créer l'instance R2 Manager
    const r2Manager = createR2ManagerFromEnv();

    // Test de connexion
    console.log("🔌 Test de connexion à Cloudflare R2...");
    const isConnected = await r2Manager.testConnection();

    if (!isConnected) {
      console.error("❌ Impossible de se connecter à Cloudflare R2");
      console.log("Vérifiez vos variables d'environnement :");
      console.log("- R2_ACCOUNT_ID");
      console.log("- R2_ACCESS_KEY_ID");
      console.log("- R2_SECRET_ACCESS_KEY");
      console.log("- R2_BUCKET_NAME");
      return;
    }

    console.log("✅ Connexion à R2 réussie");

    // Lister les images dans temp-images
    const files = fs.readdirSync(TEMP_IMAGES_DIR);
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    if (imageFiles.length === 0) {
      console.log("ℹ️ Aucune image trouvée dans temp-images/");
      console.log("Extensions supportées :", imageExtensions.join(", "));
      return;
    }

    console.log(`📸 ${imageFiles.length} images trouvées`);

    // Upload des images
    const uploadResults = await r2Manager.uploadImagesFromDirectory(
      TEMP_IMAGES_DIR,
      "products/"
    );

    // Afficher les résultats
    console.log("\n📊 Résultats de l'upload :");
    console.log("=====================================");

    Object.entries(uploadResults).forEach(([fileName, url]) => {
      console.log(`✅ ${fileName} → ${url}`);
    });

    const successCount = Object.keys(uploadResults).length;
    const failureCount = imageFiles.length - successCount;

    console.log(`\n📈 Résumé :`);
    console.log(`   • Réussies : ${successCount}`);
    console.log(`   • Échouées : ${failureCount}`);
    console.log(`   • Total : ${imageFiles.length}`);

    if (successCount > 0) {
      console.log("\n🎯 Prochaines étapes :");
      console.log(
        "1. Utilisez ces URLs dans vos fichiers JSON (champ image_url)"
      );
      console.log(
        "2. Ou supprimez les images locales avec le script de nettoyage"
      );
      console.log("3. Les URLs sont prêtes pour la production !");
    }

    // Optionnel : proposer la suppression des images locales
    if (successCount === imageFiles.length) {
      console.log("\n🧹 Toutes les images ont été uploadées avec succès.");
      console.log("Vous pouvez maintenant supprimer les images locales avec :");
      console.log("npm run clean-temp-images");
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'upload :", error);

    if (error instanceof Error) {
      if (error.message.includes("Variables d'environnement manquantes")) {
        console.log("\n🔧 Configuration requise :");
        console.log("Créez un fichier .env avec :");
        console.log("CLOUDFLARE_ACCOUNT_ID=votre_account_id");
        console.log("CLOUDFLARE_R2_ACCESS_KEY_ID=votre_access_key");
        console.log("CLOUDFLARE_R2_SECRET_ACCESS_KEY=votre_secret_key");
        console.log("CLOUDFLARE_R2_BUCKET_NAME=votre_bucket_name");
      }
    }
  }
}

// Exécution
uploadAllImages().catch(console.error);
