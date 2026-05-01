import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ListeEtudiants() {
  const [etudiants, setEtudiants] = useState([]);
  const navigate = useNavigate();

  // Charger les données depuis le backend
  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/etudiants');
      setEtudiants(res.data);
    } catch (err) {
      console.error("Erreur de récupération des données", err);
    }
  };

  // Gérer la suppression
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/etudiant/${id}`);
        fetchData(); // Rafraîchir la liste après suppression
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Liste des étudiants</h2>
        <button onClick={() => navigate('/ajout')} className="btn btn-primary">Ajouter Nouveau</button>
      </div>
      
      <table className="table table-striped table-hover border shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Matricule</th>
            <th>Nom</th>
            <th>Note Maths</th>
            <th>Note Phys</th>
            <th>Moyenne</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {etudiants.length > 0 ? (
            etudiants.map(e => (
              <tr key={e.numRt}>
                <td>{e.numRt}</td>
                <td>{e.nom}</td>
                <td>{e.note_math}</td>
                <td>{e.note_phys}</td>
                <td className="fw-bold text-primary">
                  {e.moyenne ? parseFloat(e.moyenne).toFixed(2) : "N/A"}
                </td>
                <td>
                  <button 
                    onClick={() => navigate(`/modifier/${e.numRt}`)} 
                    className="btn btn-warning btn-sm me-2">
                    Modifier
                  </button>
                  <button 
                    onClick={() => handleDelete(e.numRt)} 
                    className="btn btn-danger btn-sm">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6" className="text-center">Aucun étudiant trouvé.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}