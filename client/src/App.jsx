import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importation des composants (assure-toi que les chemins sont corrects)
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import AjoutEtudiant from './pages/AjoutEtudiant';
import ListeEtudiants from './pages/ListeEtudiants';
import Bilan from './pages/Bilan';
import ModifierEtudiant from './pages/ModifierEtudiant';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Route publique : La page de login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Routes protégées par le Layout (Menu + Header + Footer) */}
        <Route path="/" element={<Layout />}>
          {/* Redirection par défaut vers la page d'ajout si on va sur la racine */}
          <Route index element={<Navigate to="/ajout" />} />
          
          <Route path="ajout" element={<AjoutEtudiant />} />
          <Route path="liste" element={<ListeEtudiants />} />
          <Route path="bilan" element={<Bilan />} />
          <Route path="modifier/:numRt" element={<ModifierEtudiant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;