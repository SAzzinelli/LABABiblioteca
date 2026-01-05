# 🔄 Fix: Loop di Reindirizzamenti (Too Many Redirects)

## Problema
Errore "troppi reindirizzamenti" quando si accede a `https://biblioteca.laba.biz`

## Causa
Probabilmente un conflitto tra Cloudflare e Railway nella gestione HTTPS/HTTP.

## Soluzione: Verifica Impostazioni Cloudflare

### 1. SSL/TLS Settings

1. Vai su **Cloudflare Dashboard** → `laba.biz`
2. Vai su **SSL/TLS** → **Overview**
3. Verifica la modalità SSL:
   - ✅ **"Full"** o **"Full (strict)"** (consigliato)
   - ❌ NON usare "Flexible" (causa problemi con Railway)

### 2. Always Use HTTPS

1. Vai su **SSL/TLS** → **Edge Certificates**
2. Verifica **"Always Use HTTPS"**:
   - Se è **ON**: prova a disabilitarlo temporaneamente
   - Se è **OFF**: prova ad abilitarlo

### 3. Automatic HTTPS Rewrites

1. Vai su **SSL/TLS** → **Edge Certificates**
2. Verifica **"Automatic HTTPS Rewrites"**:
   - Prova a **disabilitarlo** se è abilitato

### 4. Page Rules

1. Vai su **Rules** → **Page Rules**
2. Verifica se ci sono regole per `biblioteca.laba.biz` che fanno redirect
3. Se ci sono, **eliminale temporaneamente**

## Soluzione Alternativa: Disabilita Proxy Cloudflare

Se il problema persiste:

1. Vai su **DNS** → Record per `biblioteca`
2. Clicca sul cloud (arancione) per disabilitare il proxy
3. Il cloud diventa **grigio** (DNS Only)
4. Attendi 1-2 minuti
5. Prova ad accedere

**Nota**: Senza proxy, perdi la protezione DDoS di Cloudflare, ma il sito dovrebbe funzionare.

## Verifica Railway

1. Vai su **Railway** → servizio "LABABiblioteca" → **Settings** → **Networking**
2. Verifica che il custom domain `biblioteca.laba.biz` sia configurato correttamente
3. Verifica che non ci siano redirect configurati

## Test Rapido

Prova ad accedere direttamente all'URL Railway (senza custom domain):
- Vai su Railway → servizio → **Settings** → **Networking**
- Copia l'URL `.railway.app`
- Prova ad accedere a quell'URL

Se funziona, il problema è nella configurazione Cloudflare.
