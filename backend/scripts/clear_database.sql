-- ⚠️ ATTENZIONE: Questo script cancella TUTTI i dati dal database
-- Eseguire SOLO sul database della Biblioteca LABA (Project ID: blqoxovrrldfedgzwufa)
-- 
-- ISTRUZIONI:
-- 1. Vai su Supabase Dashboard → SQL Editor
-- 2. Seleziona il progetto "Biblioteca LABA" (blqoxovrrldfedgzwufa)
-- 3. Incolla questo script
-- 4. Esegui lo script

BEGIN;

-- Cancella tutti i dati mantenendo le tabelle
-- L'ordine è importante per rispettare i foreign key constraints

TRUNCATE TABLE user_penalties CASCADE;
TRUNCATE TABLE password_reset_requests CASCADE;
TRUNCATE TABLE keepalive_log CASCADE;
TRUNCATE TABLE segnalazioni CASCADE;
TRUNCATE TABLE prestiti CASCADE;
TRUNCATE TABLE richieste CASCADE;
TRUNCATE TABLE riparazioni CASCADE;
TRUNCATE TABLE inventario_corsi CASCADE;
TRUNCATE TABLE inventario_unita CASCADE;
TRUNCATE TABLE inventario CASCADE;
TRUNCATE TABLE categorie_semplici CASCADE;

-- Cancella tutti gli utenti tranne l'admin (se esiste)
-- Se vuoi cancellare anche l'admin, decommenta la riga successiva
DELETE FROM users WHERE email != 'admin';
-- DELETE FROM users; -- Decommenta per cancellare anche l'admin

-- Reset dei sequence (per ripartire da ID 1)
ALTER SEQUENCE IF EXISTS users_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS inventario_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS prestiti_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS richieste_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS riparazioni_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS segnalazioni_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS categorie_semplici_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS inventario_unita_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS user_penalties_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS password_reset_requests_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS keepalive_log_id_seq RESTART WITH 1;

COMMIT;

-- ✅ Database pulito!
-- Ora riavvia il servizio Railway per ricreare:
-- - L'utente admin (se è stato cancellato)
-- - I corsi accademici
-- - Le categorie iniziali (se necessario)
