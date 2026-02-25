// backend/routes/collane.js - Gestione collane (raggruppano 2+ libri)
import { Router } from 'express';
import { query } from '../utils/postgres.js';

const r = Router();

// GET /api/collane
r.get('/', async (req, res) => {
  try {
    const result = await query('SELECT id, nome FROM collane ORDER BY nome');
    res.json(result);
  } catch (error) {
    console.error('Errore GET collane:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// POST /api/collane
r.post('/', async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome || nome.trim() === '') {
      return res.status(400).json({ error: 'Nome collana è obbligatorio' });
    }
    const existing = await query('SELECT id FROM collane WHERE nome = $1', [nome.trim()]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Collana già esistente' });
    }
    const result = await query('INSERT INTO collane (nome) VALUES ($1) RETURNING *', [nome.trim()]);
    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Errore POST collane:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// PUT /api/collane/:id
r.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;
    if (!nome || nome.trim() === '') {
      return res.status(400).json({ error: 'Nome collana è obbligatorio' });
    }
    const existing = await query('SELECT id FROM collane WHERE id = $1', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Collana non trovata' });
    }
    const nameExists = await query('SELECT id FROM collane WHERE nome = $1 AND id != $2', [nome.trim(), id]);
    if (nameExists.length > 0) {
      return res.status(409).json({ error: 'Nome collana già esistente' });
    }
    const result = await query('UPDATE collane SET nome = $1 WHERE id = $2 RETURNING *', [nome.trim(), id]);
    res.json(result[0]);
  } catch (error) {
    console.error('Errore PUT collane:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// DELETE /api/collane/:id
r.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id FROM collane WHERE id = $1', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Collana non trovata' });
    }
    // Rimuovi l'assegnazione dagli articoli (set collana_id = NULL)
    await query('UPDATE inventario SET collana_id = NULL WHERE collana_id = $1', [id]);
    await query('DELETE FROM collane WHERE id = $1', [id]);
    res.json({ message: 'Collana eliminata con successo' });
  } catch (error) {
    console.error('Errore DELETE collane:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

export default r;
