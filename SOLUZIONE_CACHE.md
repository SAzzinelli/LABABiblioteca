# 🔍 Soluzione: Dati Vecchi nel Frontend

## Problema
Il frontend mostra dati del vecchio gestionale anche se il database Supabase nuovo è vuoto.

## Cause Possibili

### 1. Cache del Browser (Più Probabile)
Il browser ha in cache:
- Service Worker (`laba-biblioteca-v1`)
- localStorage (token di autenticazione)
- Cache HTTP

### 2. Variabile d'Ambiente Railway
`VITE_API_BASE_URL` potrebbe non essere impostata correttamente su Railway.

## Soluzioni

### Soluzione 1: Pulire Cache del Browser (CONSIGLIATO)

1. **Apri DevTools** (F12 o Cmd+Option+I)
2. **Vai su Application** (Chrome) o **Storage** (Firefox)
3. **Pulisci tutto:**
   - Service Workers → Unregister
   - Cache Storage → Delete All
   - Local Storage → Clear All
   - Session Storage → Clear All
4. **Oppure usa Incognito/Private Mode** per testare

### Soluzione 2: Verificare Variabile Railway

1. Vai su Railway → servizio "LABABiblioteca" → Variables
2. Verifica che `VITE_API_BASE_URL` sia impostata a:
   ```
   https://biblioteca.laba.biz
   ```
3. Se manca o è sbagliata, aggiungila/modificala
4. Riavvia il servizio

### Soluzione 3: Hard Refresh

- **Chrome/Edge**: `Ctrl+Shift+R` (Windows) o `Cmd+Shift+R` (Mac)
- **Firefox**: `Ctrl+F5` (Windows) o `Cmd+Shift+R` (Mac)
- **Safari**: `Cmd+Option+R`

### Soluzione 4: Verificare Network Tab

1. Apri DevTools → Network
2. Ricarica la pagina
3. Controlla le chiamate API:
   - Devono andare a `https://biblioteca.laba.biz/api/...`
   - NON devono andare al vecchio dominio

## Verifica Finale

Dopo aver pulito la cache:
1. Apri `https://biblioteca.laba.biz` in una finestra privata
2. Fai login con `admin / laba2025`
3. L'inventario dovrebbe essere vuoto (database nuovo)

Se vedi ancora dati vecchi, il problema è nella configurazione Railway.
