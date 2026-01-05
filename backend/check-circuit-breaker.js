import pkg from 'pg';
const { Client } = pkg;

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres.blqoxovrrldfedgzwufa:Biblioteca.bellissima26!!@aws-1-eu-central-1.pooler.supabase.com:6543/postgres';

console.log('🔍 Verifica stato Circuit Breaker Supabase...');
console.log('');

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000 // Timeout breve per test rapido
});

const startTime = Date.now();

try {
  await client.connect();
  const connectTime = Date.now() - startTime;
  
  console.log('✅ Circuit Breaker: DISATTIVO');
  console.log(`   Connessione riuscita in ${connectTime}ms`);
  console.log('');
  
  // Test query semplice
  const result = await client.query('SELECT current_database(), current_user, version()');
  console.log('📊 Database Info:');
  console.log('   Database:', result.rows[0].current_database);
  console.log('   User:', result.rows[0].current_user);
  console.log('   PostgreSQL:', result.rows[0].version.split(',')[0]);
  
  // Test query su una tabella esistente
  try {
    const tables = await client.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('   Tabelle pubbliche:', tables.rows[0].count);
  } catch (e) {
    console.log('   (Impossibile contare le tabelle)');
  }
  
  console.log('');
  console.log('✅ Il database è accessibile e funzionante!');
  process.exit(0);
  
} catch (error) {
  const connectTime = Date.now() - startTime;
  
  if (error.message.includes('Circuit breaker')) {
    console.log('❌ Circuit Breaker: ATTIVO');
    console.log(`   Tentativo fallito in ${connectTime}ms`);
    console.log('');
    console.log('⚠️  Il pooler di Supabase ha bloccato le connessioni.');
    console.log('   Codice errore:', error.code);
    console.log('   Messaggio:', error.message);
    console.log('');
    console.log('💡 Soluzione:');
    console.log('   Attendi altri 5-10 minuti senza fare tentativi.');
    console.log('   Il circuit breaker si resetta automaticamente.');
    process.exit(1);
  } else if (error.message.includes('password')) {
    console.log('❌ Errore: Autenticazione fallita');
    console.log('   Verifica che la password nel DATABASE_URL sia corretta.');
    process.exit(1);
  } else if (error.message.includes('timeout')) {
    console.log('⏳ Timeout: La connessione è troppo lenta');
    console.log('   Potrebbe essere un problema temporaneo di rete.');
    process.exit(1);
  } else {
    console.log('❌ Errore sconosciuto:');
    console.log('   Codice:', error.code);
    console.log('   Messaggio:', error.message);
    process.exit(1);
  }
} finally {
  try {
    await client.end();
  } catch (e) {
    // Ignora errori di chiusura
  }
}
