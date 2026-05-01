import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function ModifierEtudiant() {
  const { numRt } = useParams(); 
  const navigate = useNavigate();
  
  // Initialisation avec des valeurs vides pour éviter les erreurs d'affichage au début
  const [etudiant, setEtudiant] = useState({ 
    nom: '', 
    note_math: '', 
    note_phys: '' 
  });

  // 1. Charger les données par défaut
  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/etudiant/${numRt}`);
        // IMPORTANT: On mappe les données reçues de la BDD vers l'état React
        setEtudiant({
          nom: res.data.nom,
          note_math: res.data.note_math,
          note_phys: res.data.note_phys
        });
      } catch (err) {
        console.error("Erreur au chargement", err);
      }
    };
    chargerDonnees();
  }, [numRt]);

  // 2. Fonction d'enregistrement
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // On envoie l'objet 'etudiant' complet au backend
      const response = await axios.put(`http://localhost:5000/api/etudiant/${numRt}`, etudiant);
      
      if (response.data.success || response.status === 200) {
        alert("Modification réussie !");
        navigate('/liste'); 
      }
    } catch (err) {
      console.error("Erreur à l'enregistrement", err);
      alert("Erreur lors de la modification. Vérifiez la console.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Modifier l'étudiant : {numRt}</h2>
      
      <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input 
            className="form-control" 
            value={etudiant.nom || ''} // Affiche la valeur par défaut
            onChange={(e) => setEtudiant({...etudiant, nom: e.target.value})} 
            required 
          />
        </div>

        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Note Maths</label>
            <input 
              className="form-control" 
              type="number" 
              step="0.01"
              value={etudiant.note_math || ''} // Affiche la valeur par défaut
              onChange={(e) => setEtudiant({...etudiant, note_math: e.target.value})} 
              required 
            />
          </div>
          <div className="col mb-3">
            <label className="form-label">Note Physique</label>
            <input 
              className="form-control" 
              type="number" 
              step="0.01"
              value={etudiant.note_phys || ''} // Affiche la valeur par défaut
              onChange={(e) => setEtudiant({...etudiant, note_phys: e.target.value})} 
              required 
            />
          </div>
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Enregistrer les modifications</button>
          <button type="button" onClick={() => navigate('/liste')} className="btn btn-secondary">Annuler</button>
        </div>
      </form>
    </div>
  );
}