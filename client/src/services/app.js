import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ListeEtudiants from './ListeEtudiants';
import AjoutEtudiant from './AjoutEtudiant';
import ModifierEtudiant from './ModifierEtudiant';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/liste">Gestion Scolaire</Link>
          <div className="navbar-nav">
            <Link className="nav-link" to="/liste">Liste</Link>
            <Link className="nav-link" to="/ajout">Ajouter</Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/liste" element={<ListeEtudiants />} />
        <Route path="/ajout" element={<AjoutEtudiant />} />
        <Route path="/modifier/:numRt" element={<ModifierEtudiant />} />
        <Route path="/" element={<ListeEtudiants />} />
      </Routes>
    </Router>
  );
}

export default App;