import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';
import ConfirmDialog from '../components/ConfirmDialog';
import API_URL from '../config';

export default function ModifierEtudiant() {
  const { numRt } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [etudiant, setEtudiant] = useState({ nom: '', note_math: '', note_phys: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialog, setDialog] = useState(false);

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/etudiant/${numRt}`);
        setEtudiant({ nom: res.data.nom, note_math: res.data.note_math, note_phys: res.data.note_phys });
      } catch (err) {
        console.error('Erreur au chargement', err);
      } finally {
        setLoading(false);
      }
    };
    chargerDonnees();
  }, [numRt]);

  const handleConfirm = async () => {
    setDialog(false);
    setSaving(true);
    try {
      await axios.put(`${API_URL}api/etudiant/${numRt}`, etudiant);
      toast('Modifications enregistrées avec succès !', 'success');
      navigate('/liste');
    } catch {
      toast('Erreur lors de la modification.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';

  const labelClass = 'block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5';

  if (loading) {
    return <div className="flex items-center justify-center h-48 text-slate-400 text-sm">Chargement...</div>;
  }

  return (
    <div className="max-w-xl mx-auto">
      <ConfirmDialog
        isOpen={dialog}
        type="edit"
        title="Confirmer la modification ?"
        message={`Vous allez modifier les informations de l'étudiant "${etudiant.nom}".`}
        onConfirm={handleConfirm}
        onCancel={() => setDialog(false)}
      />

      <div className="mb-6">
        <button
          onClick={() => navigate('/liste')}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm mb-3 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Retour à la liste
        </button>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Modifier l'étudiant</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-slate-400 text-sm">Matricule :</span>
          <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{numRt}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <form onSubmit={(e) => { e.preventDefault(); setDialog(true); }} className="space-y-5">
          <div>
            <label className={labelClass}>Nom complet</label>
            <input
              className={inputClass}
              value={etudiant.nom || ''}
              onChange={(e) => setEtudiant({ ...etudiant, nom: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Note Maths</label>
              <input
                className={inputClass}
                type="number" step="0.01" min="0" max="20"
                value={etudiant.note_math || ''}
                onChange={(e) => setEtudiant({ ...etudiant, note_math: e.target.value })}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Note Physique</label>
              <input
                className={inputClass}
                type="number" step="0.01" min="0" max="20"
                value={etudiant.note_phys || ''}
                onChange={(e) => setEtudiant({ ...etudiant, note_phys: e.target.value })}
                required
              />
            </div>
          </div>

          {etudiant.note_math && etudiant.note_phys && (
            <div className="bg-slate-50 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-slate-500 text-sm">Moyenne calculée</span>
              <span className={`text-base font-bold ${
                (parseFloat(etudiant.note_math) + parseFloat(etudiant.note_phys)) / 2 >= 10
                  ? 'text-emerald-600' : 'text-red-500'
              }`}>
                {((parseFloat(etudiant.note_math) + parseFloat(etudiant.note_phys)) / 2).toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/liste')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-lg transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}