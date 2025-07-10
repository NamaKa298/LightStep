import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { createHash } from "crypto";

interface CloudflareConfig {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  region?: string;
}

export class CloudflareR2Manager {
  private s3Client: S3Client;
  private bucketName: string;
  private config: CloudflareConfig;

  constructor(config: CloudflareConfig) {
    this.config = config;
    this.bucketName = config.bucketName;

    // Configuration pour Cloudflare R2
    this.s3Client = new S3Client({
      region: config.region || "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      // Configuration spécifique pour R2
      forcePathStyle: true,
    });
  }

  /**
   * Upload un fichier vers Cloudflare R2
   */
  async uploadFile(
    localFilePath: string,
    remoteKey: string,
    contentType?: string
  ): Promise<string> {
    try {
      if (!fs.existsSync(localFilePath)) {
        throw new Error(`Le fichier ${localFilePath} n'existe pas`);
      }

      const fileContent = fs.readFileSync(localFilePath);

      // Auto-détection du content-type si non fourni
      if (!contentType) {
        const ext = path.extname(localFilePath).toLowerCase();
        contentType = this.getContentType(ext);
      }

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: remoteKey,
        Body: fileContent,
        ContentType: contentType,
        // Métadonnées optionnelles
        Metadata: {
          "original-name": path.basename(localFilePath),
          "upload-date": new Date().toISOString(),
        },
      });

      await this.s3Client.send(command);

      // Retourne l'URL publique (si votre bucket est configuré pour être public)
      const publicUrl = `https://${this.bucketName}.${this.config.accountId}.r2.cloudflarestorage.com/${remoteKey}`;

      console.log(`✅ Fichier uploadé: ${localFilePath} → ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      console.error(`❌ Erreur lors de l'upload de ${localFilePath}:`, error);
      throw error;
    }
  }

  /**
   * Upload multiple images d'un dossier
   */
  async uploadImagesFromDirectory(
    localDirectory: string,
    remotePrefix: string = "products/"
  ): Promise<{ [localFileName: string]: string }> {
    const results: { [localFileName: string]: string } = {};

    if (!fs.existsSync(localDirectory)) {
      console.warn(`⚠️ Le dossier ${localDirectory} n'existe pas`);
      return results;
    }

    const files = fs.readdirSync(localDirectory);
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    if (imageFiles.length === 0) {
      console.warn(`⚠️ Aucune image trouvée dans ${localDirectory}`);
      return results;
    }

    console.log(`📤 Upload de ${imageFiles.length} images vers R2...`);

    for (const fileName of imageFiles) {
      try {
        const localPath = path.join(localDirectory, fileName);
        const remoteKey = `${remotePrefix}${fileName}`;

        const publicUrl = await this.uploadFile(localPath, remoteKey);
        results[fileName] = publicUrl;
      } catch (error) {
        console.error(`❌ Erreur pour ${fileName}:`, error);
      }
    }

    console.log(
      `✅ Upload terminé: ${Object.keys(results).length}/${
        imageFiles.length
      } images uploadées`
    );
    return results;
  }

  /**
   * Supprime un fichier de R2
   */
  async deleteFile(remoteKey: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: remoteKey,
      });

      await this.s3Client.send(command);
      console.log(`🗑️ Fichier supprimé: ${remoteKey}`);
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression de ${remoteKey}:`, error);
      throw error;
    }
  }

  /**
   * Génère un nom de fichier unique basé sur le hash du contenu
   */
  static generateUniqueFileName(originalPath: string): string {
    const content = fs.readFileSync(originalPath);
    const hash = createHash("md5")
      .update(content)
      .digest("hex")
      .substring(0, 8);
    const ext = path.extname(originalPath);
    const baseName = path.basename(originalPath, ext);

    return `${baseName}-${hash}${ext}`;
  }

  /**
   * Détermine le Content-Type basé sur l'extension
   */
  private getContentType(extension: string): string {
    const contentTypes: { [key: string]: string } = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
    };

    return contentTypes[extension] || "application/octet-stream";
  }

  /**
   * Vérifie la connexion à R2
   */
  async testConnection(): Promise<boolean> {
    try {
      // Test simple: essayer de lister le bucket
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: "test-connection-file-that-should-not-exist",
      });

      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      // Si l'erreur est "NoSuchKey", c'est bon signe (bucket accessible)
      if (error.name === "NoSuchKey") {
        return true;
      }

      console.error("❌ Erreur de connexion à R2:", error.message);
      return false;
    }
  }
}

/**
 * Fonction utilitaire pour créer une instance R2 depuis les variables d'environnement
 */
export function createR2ManagerFromEnv(): CloudflareR2Manager {
  const config: CloudflareConfig = {
    accountId: process.env.R2_ACCOUNT_ID!,
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    bucketName: process.env.R2_BUCKET_NAME!,
  };

  // Vérification des variables d'environnement
  const missingVars = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Variables d'environnement manquantes: ${missingVars.join(", ")}`
    );
  }

  return new CloudflareR2Manager(config);
}
