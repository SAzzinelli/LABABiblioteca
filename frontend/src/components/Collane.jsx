import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const Collane = () => {
  const [collane, setCollane] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newNome, setNewNome] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editNome, setEditNome] = useState('');
  const { token } = useAuth();

  const fetchCollane = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/collane`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Errore nel caricamento collane');
      const data = await res.json();
      setCollane(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollane();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newNome.trim()) return;
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/api/collane`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nome: newNome.trim() })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Errore creazione collana');
      }
      setNewNome('');
      await fetchCollane();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    setEditNome(c.nome);
  };

  const handleSaveEdit = async () => {
    if (editingId == null || !editNome.trim()) return;
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/api/collane/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nome: editNome.trim() })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Errore modifica collana');
      }
      setEditingId(null);
      setEditNome('');
      await fetchCollane();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNome('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminare questa collana? Gli articoli assegnati non verranno eliminati, ma non saranno più in collana.')) return;
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/api/collane/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Errore eliminazione collana');
      await fetchCollane();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8 mx-4 sm:mx-6 lg:mx-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Collane</h1>
        <p className="text-gray-600 text-lg">
          Le collane raggruppano due o più libri. Assegna una collana agli articoli dal Catalogo, nello step Descrizione.
        </p>
      </div>

      <div className="mx-4 sm:mx-6 lg:mx-8 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nuova collana</label>
            <form onSubmit={handleAdd} className="flex gap-3">
              <input
                type="text"
                value={newNome}
                onChange={(e) => setNewNome(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Nome collana..."
              />
              <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-medium">
                Aggiungi
              </button>
            </form>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-3">Collane esistenti</h3>
          <div className="space-y-2">
            {collane.length === 0 ? (
              <p className="text-gray-500 py-4">Nessuna collana. Aggiungine una sopra.</p>
            ) : (
              collane.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  {editingId === c.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editNome}
                        onChange={(e) => setEditNome(e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-teal-500"
                        placeholder="Nome collana..."
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                      />
                      <button type="button" onClick={handleSaveEdit} className="text-teal-600 hover:text-teal-800 p-1" title="Salva">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </button>
                      <button type="button" onClick={handleCancelEdit} className="text-gray-600 hover:text-gray-800 p-1" title="Annulla">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium text-gray-900">{c.nome}</span>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => handleEdit(c)} className="text-teal-600 hover:text-teal-800 p-1" title="Modifica">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button type="button" onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-800 p-1" title="Elimina">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collane;
