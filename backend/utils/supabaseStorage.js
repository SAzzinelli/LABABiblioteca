// backend/utils/supabaseStorage.js - Gestione Supabase Storage
import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Configurazione Supabase - Biblioteca LABA
// IMPORTANTE: Le credenziali devono essere fornite tramite variabili d'ambiente per sicurezza
// Validazione lazy: controlla solo quando necessario, non all'import
function getSupabaseConfig() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_URL e SUPABASE_ANON_KEY devono essere configurate come variabili d\'ambiente');
  }
  return {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY
  };
}

function getStorageConfig() {
  const supabaseConfig = getSupabaseConfig();
  if (!process.env.SUPABASE_STORAGE_ACCESS_KEY_ID || !process.env.SUPABASE_STORAGE_SECRET_ACCESS_KEY) {
    throw new Error('SUPABASE_STORAGE_ACCESS_KEY_ID e SUPABASE_STORAGE_SECRET_ACCESS_KEY devono essere configurate come variabili d\'ambiente');
  }
  return {
    endpoint: process.env.SUPABASE_STORAGE_ENDPOINT || `${supabaseConfig.url.replace('.supabase.co', '.storage.supabase.co')}/storage/v1/s3`,
    region: process.env.SUPABASE_STORAGE_REGION || 'eu-central-1',
    accessKeyId: process.env.SUPABASE_STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.SUPABASE_STORAGE_SECRET_ACCESS_KEY
  };
}

// Lazy initialization: crea client solo quando necessario
let supabaseClient = null;
function getSupabaseClient() {
  if (!supabaseClient) {
    const config = getSupabaseConfig();
    supabaseClient = createClient(config.url, config.key);
  }
  return supabaseClient;
}

// Lazy initialization: crea S3 client solo quando necessario
let s3ClientInstance = null;
function getS3Client() {
  if (!s3ClientInstance) {
    const storageConfig = getStorageConfig();
    s3ClientInstance = new S3Client({
      endpoint: storageConfig.endpoint,
      region: storageConfig.region,
      credentials: {
        accessKeyId: storageConfig.accessKeyId,
        secretAccessKey: storageConfig.secretAccessKey
      },
      forcePathStyle: true // Necessario per Supabase Storage
    });
  }
  return s3ClientInstance;
}

// Export per compatibilità (lazy)
const supabase = {
  get client() {
    return getSupabaseClient();
  }
};

// Upload file a Supabase Storage tramite S3
export async function uploadFile(bucket, filePath, fileBuffer, contentType) {
  try {
    const s3Client = getS3Client();
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: filePath,
      Body: fileBuffer,
      ContentType: contentType
    });

    const result = await s3Client.send(command);
    console.log('File caricato su Supabase Storage:', result);
    
    return {
      path: filePath,
      fullPath: `${bucket}/${filePath}`,
      etag: result.ETag
    };
  } catch (error) {
    console.error('Errore upload file:', error);
    throw error;
  }
}

// Download file da Supabase Storage tramite S3
export async function downloadFile(bucket, filePath) {
  try {
    const s3Client = getS3Client();
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: filePath
    });

    const result = await s3Client.send(command);
    return result.Body;
  } catch (error) {
    console.error('Errore download file:', error);
    throw error;
  }
}

// Elimina file da Supabase Storage tramite S3
export async function deleteFile(bucket, filePath) {
  try {
    const s3Client = getS3Client();
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: filePath
    });

    await s3Client.send(command);
    console.log('File eliminato da Supabase Storage:', filePath);
    return true;
  } catch (error) {
    console.error('Errore eliminazione file:', error);
    throw error;
  }
}

// Ottieni URL pubblico del file
export function getPublicUrl(bucket, filePath) {
  // Per Supabase Storage, l'URL pubblico è costruito così:
  const config = getSupabaseConfig();
  return `${config.url}/storage/v1/object/public/${bucket}/${filePath}`;
}

export default supabase;
