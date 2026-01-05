# 📚 Transizione da Gestionale Attrezzature a Biblioteca LABA

## ✅ Modifiche Completate

### 1. Credenziali Supabase
- ✅ **URL Supabase**: Aggiornato da `kzqabwmtpmlhaueqiuoc` a `blqoxovrrldfedgzwufa`
- ✅ **ANON_KEY**: Aggiornato con la nuova chiave fornita
- ✅ **File modificati**:
  - `backend/utils/supabaseStorage.js`
  - `backend/server.js`

**⚠️ IMPORTANTE**: Le credenziali S3 Storage devono essere configurate nel progetto Supabase della Biblioteca e impostate come variabili d'ambiente:
- `SUPABASE_STORAGE_ACCESS_KEY_ID`
- `SUPABASE_STORAGE_SECRET_ACCESS_KEY`

### 2. Repository GitHub
- ✅ **Nuovo repository**: `https://github.com/SAzzinelli/LABABiblioteca.git`
- ✅ **File aggiornati**:
  - `README.md` (tutti i riferimenti al repository)

### 3. Branding e Testi
- ✅ **"Service Attrezzatura"** → **"Biblioteca LABA"**
- ✅ **"attrezzature"** → **"libri"** o **"materiali biblioteca"**
- ✅ **"noleggio"** → **"prestito"**
- ✅ **File modificati**:
  - `frontend/src/auth/Login.jsx`
  - `frontend/src/components/Footer.jsx`
  - `frontend/src/components/UserDashboard.jsx`
  - `frontend/src/components/Loans.jsx`
  - `frontend/src/components/Dashboard.jsx`
  - `frontend/src/components/Repairs.jsx`
  - `frontend/src/components/Statistics.jsx`
  - `frontend/src/components/AdvancedStats.jsx`
  - `frontend/src/components/UserManagement.jsx`
  - `frontend/public/sw.js`
  - `frontend/index.html`
  - `frontend/src/App.jsx`
  - `backend/routes/inventario.js`
  - `README.md`

### 4. Package.json
- ✅ **Backend**: `laba-gestione-backend` → `laba-biblioteca-backend`
- ✅ **Frontend**: `laba-gestione-frontend` → `laba-biblioteca-frontend`

### 5. Service Worker
- ✅ **Cache name**: `laba-gestione-v1` → `laba-biblioteca-v1`

## 🔒 Sicurezza - Database e Credenziali

### ⚠️ IMPORTANTE: Non sovrascrivere il database esistente

Le modifiche effettuate **NON toccano il database**. Solo le credenziali di connessione sono state aggiornate:

1. **Database separato**: Il nuovo progetto Supabase (`blqoxovrrldfedgzwufa`) ha un database completamente separato dal vecchio progetto
2. **Nessuna migrazione automatica**: Non sono state eseguite migrazioni o modifiche al database
3. **Variabili d'ambiente**: Le credenziali sono configurate tramite variabili d'ambiente, quindi:
   - In sviluppo: usa un file `.env` locale
   - In produzione (Railway): configura le variabili d'ambiente nel pannello Railway

### Variabili d'Ambiente Richieste

#### Backend (.env o Railway)
```env
# Supabase
SUPABASE_URL=https://blqoxovrrldfedgzwufa.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJscW94b3ZycmxkZmVkZ3p3dWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjY4MjAsImV4cCI6MjA4MzIwMjgyMH0.Z7NT3zZSvlr5Oo-ZgVBFrSQSGakHBC0SYw7zazogJIA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJscW94b3ZycmxkZmVkZ3p3dWZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzYyNjgyMCwiZXhwIjoyMDgzMjAyODIwfQ.bChHq9iV-sFFWALokAmfB4bnp-fFnu7FX-Ot7F2rweo

# Database (Pooler Supabase)
DATABASE_URL=postgresql://postgres.blqoxovrrldfedgzwufa:[YOUR-PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:6543/postgres

# JWT
JWT_SECRET=PEEex2waNc0ESUjJmk6diVOdPVoOZe/yRIeVMOTxkIvyzkdClGw1g/4KfIYJyD0XHVcFiVzRF1DOwCiZJTYB0g==
JWT_EXPIRES_IN=24h

# Server
PORT=3001
NODE_ENV=production

# CORS
CORS_ORIGIN=https://biblioteca.laba.biz

# Storage S3 (da configurare in Supabase)
SUPABASE_STORAGE_ACCESS_KEY_ID=9f59fc508910d08c24f74f124bdac370
SUPABASE_STORAGE_SECRET_ACCESS_KEY=15153748c7bc2ea8144c8fb3e6a005ccbbb24a781cfd4948af7a5c0c5325cdf1
```

#### Frontend (.env o Railway)
```env
# Se backend e frontend sono sullo stesso dominio, lascia vuoto o usa il dominio stesso
VITE_API_BASE_URL=https://biblioteca.laba.biz
# Oppure se vuoi usare percorsi relativi (raccomandato):
# VITE_API_BASE_URL=
VITE_NODE_ENV=production
```

## 🚀 Deploy su Railway

### Passi da seguire:

1. **Push su GitHub**
   ```bash
   git add .
   git commit -m "Transizione a Biblioteca LABA - aggiornamento credenziali e branding"
   git remote set-url origin https://github.com/SAzzinelli/LABABiblioteca.git
   git push -u origin main
   ```

2. **Configurazione Railway**
   - Vai su [Railway.app](https://railway.app)
   - Crea un nuovo progetto o usa quello esistente
   - Connetti il repository `LABABiblioteca`
   - Railway rileverà automaticamente la configurazione da `railway.json`

3. **Variabili d'Ambiente Railway**
   - Vai nella sezione "Variables" del tuo servizio Railway
   - Aggiungi tutte le variabili d'ambiente elencate sopra
   - **IMPORTANTE**: Sostituisci `[YOUR-PASSWORD]` nella `DATABASE_URL` con la password del database Supabase

4. **Database Supabase**
   - Il database è già configurato nel progetto Supabase `blqoxovrrldfedgzwufa`
   - Verifica che le tabelle siano create (il sistema le creerà automaticamente al primo avvio)
   - Se necessario, esegui le migrazioni manualmente

5. **Cron Jobs (se presenti)**
   - Se hai cron jobs configurati su Railway per il vecchio progetto, devi:
     - Verificarli nel pannello Railway
     - Aggiornarli per puntare al nuovo progetto
     - O ricrearli se necessario

## 📝 Note Importanti

1. **Il vecchio progetto non viene toccato**: Tutte le modifiche sono state fatte solo in questa cartella (`LABA_Biblioteca`), non nella cartella originale (`LABA_gestionale`)

2. **Database separato**: Il nuovo progetto usa un database Supabase completamente separato, quindi non c'è rischio di sovrascrivere dati

3. **Credenziali S3 Storage**: Le credenziali S3 per Supabase Storage devono essere configurate nel progetto Supabase e aggiunte come variabili d'ambiente. Attualmente sono vuote nel codice per sicurezza.

4. **Test prima del deploy**: Prima di fare il deploy su Railway, testa localmente:
   ```bash
   cd backend
   npm install
   # Configura .env con le nuove credenziali
   npm start
   ```

## ✅ Checklist Pre-Deploy

- [x] Credenziali Supabase aggiornate
- [x] Repository GitHub aggiornato
- [x] Tutti i testi "attrezzature" → "biblioteca"
- [x] Branding aggiornato
- [x] Package.json aggiornati
- [ ] Test locale con nuove credenziali
- [ ] Variabili d'ambiente configurate su Railway
- [ ] Database Supabase verificato
- [ ] Credenziali S3 Storage configurate (se necessario)
- [ ] Cron jobs verificati/aggiornati (se presenti)

---

**Data transizione**: 2026-01-XX
**Versione**: 1.0.1 alpha
**Progetto**: Biblioteca LABA
