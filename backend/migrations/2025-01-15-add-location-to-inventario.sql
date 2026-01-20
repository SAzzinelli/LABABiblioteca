-- Migrazione: Aggiungere campo location alla tabella inventario
-- Data: 2025-01-15

-- Aggiungi colonna location alla tabella inventario
ALTER TABLE inventario ADD COLUMN IF NOT EXISTS location VARCHAR(255);

-- Aggiungi indice per performance (opzionale)
CREATE INDEX IF NOT EXISTS idx_inventario_location ON inventario(location);
