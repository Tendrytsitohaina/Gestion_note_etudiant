import { useState } from 'react';
import { useToast } from '../components/ToastProvider';
import axios from 'axios';
import API_URL from '../config';
import { useNavigate } from 'react-router-dom';

export default function AjoutEtudiant() {
  const [etudiant, setEtudiant] = useState({ numRt: '', nom: '', note_math: '', note_phys: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/etudiant`, etudiant);
      toast('Étudiant ajouté avec succès !', 'success');
      setEtudiant({ numRt: '', nom: '', note_math: '', note_phys: '' });
      navigate('/liste')
    } catch {
      toast("Erreur : le matricule existe peut-être déjà.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm ' +
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-400';

  const labelClass = 'block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5';

  return (
    <div className="max-w-xl mx-auto">
      {/* Titre */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Ajouter un étudiant</h2>
        <p className="text-slate-400 text-sm mt-1">Remplissez les informations ci-dessous</p>
      </div>

      {/* Carte formulaire */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Matricule */}
          <div>
            <label className={labelClass}>Numéro RT (Matricule)</label>
            <input
              className={inputClass}
              placeholder="ex: RT-2024-001"
              value={etudiant.numRt}
              onChange={(e) => setEtudiant({ ...etudiant, numRt: e.target.value })}
              required
            />
          </div>

          {/* Nom */}
          <div>
            <label className={labelClass}>Nom complet</label>
            <input
              className={inputClass}
              placeholder="ex: Rakoto Jean"
              value={etudiant.nom}
              onChange={(e) => setEtudiant({ ...etudiant, nom: e.target.value })}
              required
            />
          </div>

          {/* Notes côte à côte */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Note Maths</label>
              <input
                className={inputClass}
                type="number"
                step="0.01"
                min="0"
                max="20"
                placeholder="0 – 20"
                value={etudiant.note_math}
                onChange={(e) => setEtudiant({ ...etudiant, note_math: e.target.value })}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Note Physique</label>
              <input
                className={inputClass}
                type="number"
                step="0.01"
                min="0"
                max="20"
                placeholder="0 – 20"
                value={etudiant.note_phys}
                onChange={(e) => setEtudiant({ ...etudiant, note_phys: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors duration-150 shadow-sm mt-2"
          >
            {loading ? 'Enregistrement...' : '+ Ajouter l\'étudiant'}
          </button>
        </form>
      </div>
    </div>
  );
}