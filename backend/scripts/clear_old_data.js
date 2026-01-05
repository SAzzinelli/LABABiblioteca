import { query } from '../utils/postgres.js';

console.log('⚠️  ATTENZIONE: Questo script cancellerà TUTTI i dati dal database!');
console.log('   Assicurati di essere sul database corretto per la Biblioteca LABA.');
console.log('');
console.log('📊 Verifica Project ID dal DATABASE_URL...');

const dbUrl = process.env.DATABASE_URL || '';
const projectIdMatch = dbUrl.match(/postgres\.([^.]+)\.supabase\.co/);
if (projectIdMatch) {
  const projectId = projectIdMatch[1];
  console.log('   Project ID:', projectId);
  
  if (projectId === 'blqoxovrrldfedgzwufa') {
    console.log('   ✅ Project ID corretto per Biblioteca LABA');
  } else {
    console.log('   ❌ Project ID NON corrisponde a Biblioteca LABA!');
    console.log('   ⚠️  ATTENZIONE: Stai per cancellare dati dal database sbagliato!');
    console.log('   ⚠️  FERMA LO SCRIPT E VERIFICA LA DATABASE_URL!');
    process.exit(1);
  }
} else {
  console.log('   ⚠️  Project ID non trovato nel DATABASE_URL');
  console.log('   ⚠️  Verifica manualmente che sia il database corretto!');
}

console.log('');
console.log('📦 Contenuto attuale del database:');

try {
  const inventarioCount = await query('SELECT COUNT(*) as count FROM inventario');
  const usersCount = await query('SELECT COUNT(*) as count FROM users');
  const prestitiCount = await query('SELECT COUNT(*) as count FROM prestiti');
  
  console.log('   Inventario:', inventarioCount.rows[0].count, 'record');
  console.log('   Utenti:', usersCount.rows[0].count, 'record');
  console.log('   Prestiti:', prestitiCount.rows[0].count, 'record');
  console.log('');
  
  // Mostra esempi
  if (parseInt(inventarioCount.rows[0].count) > 0) {
    console.log('📋 Primi 5 articoli in inventario:');
    const esempi = await query('SELECT id, nome, categoria_madre FROM inventario LIMIT 5');
    esempi.rows.forEach((item, i) => {
      console.log(`   ${i + 1}. [ID: ${item.id}] ${item.nome} - ${item.categoria_madre}`);
    });
    console.log('');
  }
  
  console.log('🗑️  Procedere con la cancellazione di TUTTI i dati?');
  console.log('   (Questo script è stato creato ma NON esegue la cancellazione automaticamente)');
  console.log('');
  console.log('💡 Per cancellare i dati, esegui manualmente su Supabase SQL Editor:');
  console.log('');
  console.log('   -- Cancella tutti i dati (mantiene le tabelle)');
  console.log('   TRUNCATE TABLE prestiti CASCADE;');
  console.log('   TRUNCATE TABLE richieste CASCADE;');
  console.log('   TRUNCATE TABLE riparazioni CASCADE;');
  console.log('   TRUNCATE TABLE segnalazioni CASCADE;');
  console.log('   TRUNCATE TABLE inventario_corsi CASCADE;');
  console.log('   TRUNCATE TABLE inventario_unita CASCADE;');
  console.log('   TRUNCATE TABLE inventario CASCADE;');
  console.log('   TRUNCATE TABLE categorie_semplici CASCADE;');
  console.log('   DELETE FROM users WHERE email != \'admin\';');
  console.log('');
  console.log('   -- Oppure cancella anche l\'admin e ricrea tutto');
  console.log('   TRUNCATE TABLE users CASCADE;');
  console.log('   -- Poi riavvia il servizio per ricreare l\'admin');
  
} catch (error) {
  console.error('❌ Errore:', error.message);
  process.exit(1);
}

process.exit(0);
