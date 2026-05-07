import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AjoutEtudiant from './pages/AjoutEtudiant';
import ListeEtudiants from './pages/ListeEtudiants';
import Bilan from './pages/Bilan';
import ModifierEtudiant from './pages/ModifierEtudiant';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/liste" />} />
            <Route path="ajout" element={<AjoutEtudiant />} />
            <Route path="liste" element={<ListeEtudiants />} />
            <Route path="bilan" element={<Bilan />} />
            <Route path="modifier/:numRt" element={<ModifierEtudiant />} />
            <Route path="register" element={
              <ProtectedRoute adminOnly>
                <RegisterPage />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;