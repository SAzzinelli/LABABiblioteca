// Script per verificare quale database stiamo usando
// Eseguire su Railway o localmente con DATABASE_URL impostata

console.log('🔍 Verifica Database Supabase...');
console.log('');

const dbUrl = process.env.DATABASE_URL || '';

if (!dbUrl) {
  console.error('❌ DATABASE_URL non configurata');
  console.log('');
  console.log('💡 Per eseguire questo script:');
  console.log('   1. Su Railway: vai su Variables e copia DATABASE_URL');
  console.log('   2. Localmente: esporta DATABASE_URL nel terminale');
  console.log('   3. Poi esegui: node scripts/verify_database.js');
  process.exit(1);
}

// Estrai Project ID
const projectIdMatch = dbUrl.match(/postgres\.([^.]+)\.supabase\.co/);
if (projectIdMatch) {
  const projectId = projectIdMatch[1];
  console.log('📊 Project ID trovato:', projectId);
  console.log('');
  
  if (projectId === 'blqoxovrrldfedgzwufa') {
    console.log('✅ Project ID CORRETTO per Biblioteca LABA');
  } else {
    console.log('❌ Project ID NON corrisponde a Biblioteca LABA!');
    console.log('   Atteso: blqoxovrrldfedgzwufa');
    console.log('   Trovato:', projectId);
    console.log('');
    console.log('⚠️  PROBLEMA: Stai usando il database del vecchio gestionale!');
    console.log('   Verifica la DATABASE_URL su Railway.');
  }
} else {
  console.log('⚠️  Project ID non trovato nel DATABASE_URL');
  console.log('   Verifica che la DATABASE_URL sia corretta');
}

console.log('');
console.log('💡 Per pulire il database dai dati vecchi:');
console.log('   1. Vai su Supabase Dashboard → SQL Editor');
console.log('   2. Seleziona il progetto "Biblioteca LABA"');
console.log('   3. Esegui lo script: backend/scripts/clear_database.sql');
