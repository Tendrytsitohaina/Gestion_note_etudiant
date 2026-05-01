import { useState } from 'react';
import axios from 'axios';

export default function AjoutEtudiant() {
  const [etudiant, setEtudiant] = useState({ numRt: '', nom: '', note_math: '', note_phys: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Appel vers la route POST du backend
      await axios.post('http://localhost:5000/api/etudiant', etudiant);
      setMessage("Insertion réussie !");
      // Réinitialisation du formulaire
      setEtudiant({ numRt: '', nom: '', note_math: '', note_phys: '' });
    } catch (err) {
      setMessage("Erreur lors de l'insertion. Vérifiez si le numéro RT existe déjà.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Ajouter un étudiant</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded bg-light shadow-sm">
        <div className="mb-3">
          <label className="form-label fw-bold">Numéro RT (Matricule)</label>
          <input 
            className="form-control" 
            value={etudiant.numRt} 
            onChange={(e) => setEtudiant({...etudiant, numRt: e.target.value})} 
            required 
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">Nom complet</label>
          <input 
            className="form-control" 
            value={etudiant.nom} 
            onChange={(e) => setEtudiant({...etudiant, nom: e.target.value})} 
            required 
          />
        </div>
        <div className="row">
          <div className="col mb-3">
            <label className="form-label fw-bold">Note Maths</label>
            <input 
              className="form-control" 
              type="number" 
              step="0.01"
              value={etudiant.note_math} 
              onChange={(e) => setEtudiant({...etudiant, note_math: e.target.value})} 
              required 
            />
          </div>
          <div className="col mb-3">
            <label className="form-label fw-bold">Note Physique</label>
            <input 
              className="form-control" 
              type="number" 
              step="0.01"
              value={etudiant.note_phys} 
              onChange={(e) => setEtudiant({...etudiant, note_phys: e.target.value})} 
              required 
            />
          </div>
        </div>
        <button type="submit" className="btn btn-success w-100">Ajouter l'étudiant</button>
      </form>
      {message && <div className={`alert mt-3 ${message.includes('Erreur') ? 'alert-danger' : 'alert-success'}`}>{message}</div>}
    </div>
  );
}