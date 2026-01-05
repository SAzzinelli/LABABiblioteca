// Script per creare utente di test
import { query } from '../utils/postgres.js';
import bcrypt from 'bcryptjs';

async function createTestUser() {
  console.log('👤 Creazione utente di test...');
  
  try {
    // ATTENZIONE: Questo script crea un utente di test
    // SOLO PER AMBIENTE DI SVILUPPO/TEST - NON USARE IN PRODUZIONE
    // La password deve essere fornita tramite variabile d'ambiente TEST_USER_PASSWORD
    const testPassword = process.env.TEST_USER_PASSWORD || 'changeme123';
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    
    await query(`
      INSERT INTO users (email, password_hash, name, surname, phone, matricola, ruolo, corso_accademico)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (email) DO NOTHING
    `, [
      'test@laba.it',
      hashedPassword,
      'Mario',
      'Rossi',
      '1234567890',
      'MAT001',
      'user',
      'Fotografia'
    ]);
    
    console.log('✅ Utente di test creato con successo!');
    console.log('📧 Email: test@laba.it');
    if (process.env.TEST_USER_PASSWORD) {
      console.log('🔑 Password: [da variabile d\'ambiente TEST_USER_PASSWORD]');
    } else {
      console.log('⚠️  Password di default usata - configura TEST_USER_PASSWORD per sicurezza');
    }
    console.log('⚠️  ATTENZIONE: SOLO PER TEST - NON USARE IN PRODUZIONE');
    
  } catch (error) {
    console.error('❌ Errore creazione utente:', error);
    throw error;
  }
}

// Esegui se chiamato direttamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createTestUser()
    .then(() => {
      console.log('🎉 Utente creato!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Errore:', error);
      process.exit(1);
    });
}

export default createTestUser;
