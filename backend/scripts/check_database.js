import { query } from '../utils/postgres.js';

console.log('🔍 Verifica database Supabase...');
console.log('');

// Verifica Project ID dal DATABASE_URL
const dbUrl = process.env.DATABASE_URL || '';
const projectIdMatch = dbUrl.match(/postgres\.([^.]+)\.supabase\.co/);
if (projectIdMatch) {
  console.log('📊 Project ID trovato nel DATABASE_URL:', projectIdMatch[1]);
} else {
  console.log('⚠️  Project ID non trovato nel DATABASE_URL');
}

console.log('');

// Conta record nelle tabelle principali
try {
  const inventarioCount = await query('SELECT COUNT(*) as count FROM inventario');
  const usersCount = await query('SELECT COUNT(*) as count FROM users');
  const prestitiCount = await query('SELECT COUNT(*) as count FROM prestiti');
  const categorieCount = await query('SELECT COUNT(*) as count FROM categorie_semplici');
  
  console.log('📦 Contenuto database:');
  console.log('   Inventario:', inventarioCount.rows[0].count, 'record');
  console.log('   Utenti:', usersCount.rows[0].count, 'record');
  console.log('   Prestiti:', prestitiCount.rows[0].count, 'record');
  console.log('   Categorie:', categorieCount.rows[0].count, 'record');
  console.log('');
  
  // Mostra alcuni esempi di inventario
  if (parseInt(inventarioCount.rows[0].count) > 0) {
    console.log('📋 Esempi di articoli in inventario:');
    const esempi = await query('SELECT id, nome, categoria_madre FROM inventario LIMIT 5');
    esempi.rows.forEach((item, i) => {
      console.log(`   ${i + 1}. [ID: ${item.id}] ${item.nome} - Categoria: ${item.categoria_madre}`);
    });
    console.log('');
  }
  
  // Verifica se ci sono dati del vecchio gestionale (attrezzature)
  const attrezzatureCheck = await query(`
    SELECT COUNT(*) as count 
    FROM inventario 
    WHERE categoria_madre ILIKE '%attrezzatur%' 
       OR categoria_madre ILIKE '%video%'
       OR categoria_madre ILIKE '%foto%'
  `);
  
  if (parseInt(attrezzatureCheck.rows[0].count) > 0) {
    console.log('⚠️  ATTENZIONE: Trovati', attrezzatureCheck.rows[0].count, 'articoli che sembrano del vecchio gestionale attrezzature!');
    console.log('');
    console.log('💡 Soluzione:');
    console.log('   1. Se questo è il database corretto per la Biblioteca, cancella i dati vecchi');
    console.log('   2. Oppure verifica che la DATABASE_URL su Railway punti al database corretto');
    console.log('');
  } else {
    console.log('✅ Nessun dato del vecchio gestionale trovato');
  }
  
} catch (error) {
  console.error('❌ Errore:', error.message);
  process.exit(1);
}

process.exit(0);
