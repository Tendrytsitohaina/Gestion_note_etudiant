/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastProvider";
import ConfirmDialog from "../components/ConfirmDialog";
import API_URL from "../config";

export default function ListeEtudiants() {
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState({ open: false, id: null, nom: "" });
  const navigate = useNavigate();
  const toast = useToast();

  const [search, setSearch] = useState("");

  const filtered = etudiants.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.nom.toLowerCase().includes(q) ||
      e.numRt.toLowerCase().includes(q) ||
      String(e.note_math).includes(q) ||
      String(e.note_phys).includes(q)
    );
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/etudiants`);
      setEtudiants(res.data);
    } catch (err) {
      console.error("Erreur de récupération", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id, nom) => {
    setDialog({ open: true, id, nom });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/etudiant/${dialog.id}`);
      toast("Étudiant supprimé avec succès.", "success");
      fetchData();
    } catch {
      toast("Erreur lors de la suppression.", "error");
    } finally {
      setDialog({ open: false, id: null, nom: "" });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getMoyenneColor = (moy) => {
    if (!moy) return "text-slate-400";
    const v = parseFloat(moy);
    if (v >= 14) return "text-emerald-600 font-bold";
    if (v >= 10) return "text-blue-600 font-semibold";
    return "text-red-500 font-semibold";
  };

  return (
    <div>
      <ConfirmDialog
        isOpen={dialog.open}
        type="delete"
        title="Supprimer l'étudiant ?"
        message={`Vous êtes sur le point de supprimer "${dialog.nom}". Cette action est irréversible.`}
        onConfirm={handleDelete}
        onCancel={() => setDialog({ open: false, id: null, nom: "" })}
      />

      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Liste des étudiants
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {filtered.length} étudiant(s) enregistré(s)
          </p>
        </div>
        <div className="relative mb-4">
          <svg
            className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Rechercher par nom, matricule ou note..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
        <button
          onClick={() => navigate("/ajout")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Ajouter
        </button>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            Chargement...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[
                  "Matricule",
                  "Nom complet",
                  "Maths",
                  "Physique",
                  "Moyenne",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length > 0 ? (
                filtered.map((e) => (
                  <tr
                    key={e.numRt}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {e.numRt}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {e.nom}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{e.note_math}</td>
                    <td className="px-4 py-3 text-slate-600">{e.note_phys}</td>
                    <td className={`px-4 py-3 ${getMoyenneColor(e.moyenne)}`}>
                      {e.moyenne ? parseFloat(e.moyenne).toFixed(2) : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/modifier/${e.numRt}`)}
                          className="px-3 py-1.5 text-xs font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => confirmDelete(e.numRt, e.nom)}
                          className="px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-16 text-slate-400 text-sm"
                  >
                    {search
                      ? `Aucun résultat pour "${search}"`
                      : "Aucun étudiant trouvé."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
