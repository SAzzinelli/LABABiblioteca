// backend/utils/supabaseStorage.js - Gestione Supabase Storage
import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Configurazione Supabase - Biblioteca LABA
// IMPORTANTE: Le credenziali devono essere fornite tramite variabili d'ambiente per sicurezza
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_URL e SUPABASE_ANON_KEY devono essere configurate come variabili d\'ambiente');
}
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Configurazione Storage S3-compatibile
// IMPORTANTE: Le credenziali S3 devono essere configurate come variabili d'ambiente per sicurezza
if (!process.env.SUPABASE_STORAGE_ACCESS_KEY_ID || !process.env.SUPABASE_STORAGE_SECRET_ACCESS_KEY) {
  throw new Error('SUPABASE_STORAGE_ACCESS_KEY_ID e SUPABASE_STORAGE_SECRET_ACCESS_KEY devono essere configurate come variabili d\'ambiente');
}
const storageConfig = {
  endpoint: process.env.SUPABASE_STORAGE_ENDPOINT || `${supabaseUrl.replace('.supabase.co', '.storage.supabase.co')}/storage/v1/s3`,
  region: process.env.SUPABASE_STORAGE_REGION || 'eu-central-1',
  accessKeyId: process.env.SUPABASE_STORAGE_ACCESS_KEY_ID,
  secretAccessKey: process.env.SUPABASE_STORAGE_SECRET_ACCESS_KEY
};

const supabase = createClient(supabaseUrl, supabaseKey);

// Client S3 per Supabase Storage
const s3Client = new S3Client({
  endpoint: storageConfig.endpoint,
  region: storageConfig.region,
  credentials: {
    accessKeyId: storageConfig.accessKeyId,
    secretAccessKey: storageConfig.secretAccessKey
  },
  forcePathStyle: true // Necessario per Supabase Storage
});

// Upload file a Supabase Storage tramite S3
export async function uploadFile(bucket, filePath, fileBuffer, contentType) {
  try {
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
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`;
}

export default supabase;
