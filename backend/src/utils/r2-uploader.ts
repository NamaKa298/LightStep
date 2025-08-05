import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "dotenv/config";

// 1. Interface pour vos variables d'environnement
interface EnvVariables {
  R2_ACCOUNT_ID: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_BUCKET_NAME: string;
}

// 2. Validation des variables d'environnement
function getEnv(): EnvVariables {
  const env = {
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
  };

  for (const [key, value] of Object.entries(env)) {
    if (!value) {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }

  return env as EnvVariables;
}

// 3. Configuration type-safe du client
const createS3Client = (): S3Client => {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = getEnv();

  const config: S3ClientConfig = {
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true, // Nécessaire pour certains endpoints S3
  };

  return new S3Client(config);
};

const r2 = createS3Client();

// 2. Service de génération d'URLs signées
export const generatePresignedUrl = async (fileName: string) => {
  return getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
    }),
    { expiresIn: 3600 } // URL valide 1h
  );
};

// 3. Méthode pour supprimer des fichiers
export const deleteFile = async (fileName: string) => {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
    })
  );
};

// 4. Méthode pour lister les fichiers
export const listFiles = async () => {
  const data = await r2.send(
    new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
    })
  );
  return data.Contents || [];
};
