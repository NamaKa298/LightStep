"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFiles = exports.deleteFile = exports.generatePresignedUrl = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
require("dotenv/config");
// 2. Validation des variables d'environnement
function getEnv() {
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
    return env;
}
// 3. Configuration type-safe du client
const createS3Client = () => {
    const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = getEnv();
    const config = {
        region: "auto",
        endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: R2_ACCESS_KEY_ID,
            secretAccessKey: R2_SECRET_ACCESS_KEY,
        },
        forcePathStyle: true, // Nécessaire pour certains endpoints S3
    };
    return new client_s3_1.S3Client(config);
};
const r2 = createS3Client();
// 2. Service de génération d'URLs signées
const generatePresignedUrl = async (fileName) => {
    return (0, s3_request_presigner_1.getSignedUrl)(r2, new client_s3_1.PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
    }), { expiresIn: 3600 } // URL valide 1h
    );
};
exports.generatePresignedUrl = generatePresignedUrl;
// 3. Méthode pour supprimer des fichiers
const deleteFile = async (fileName) => {
    await r2.send(new client_s3_1.DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
    }));
};
exports.deleteFile = deleteFile;
// 4. Méthode pour lister les fichiers
const listFiles = async () => {
    const data = await r2.send(new client_s3_1.ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME,
    }));
    return data.Contents || [];
};
exports.listFiles = listFiles;
