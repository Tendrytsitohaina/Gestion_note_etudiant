import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  // Fonction pour définir la classe CSS selon si le menu est actif ou non
  const getNavLinkClass = ({ isActive }) => 
    `nav-link text-white p-3 ${isActive ? 'bg-primary' : 'hover-bg-secondary'}`;

  return (
    <div className="d-flex flex-column vh-100">
      
      {/* 1. Header Fixe */}
      <header className="bg-dark text-white p-3 text-center shadow" style={{ height: '70px' }}>
        <h2 className="m-0">Application moderne</h2>
      </header>

      {/* Corps de la page (Sidebar + Contenu) */}
      <div className="d-flex flex-grow-1 overflow-hidden">
        
        {/* 2. Sidebar (Menu) */}
        <nav className="bg-dark text-white d-flex flex-column" style={{ width: '250px' }}>
          <ul className="nav flex-column mt-2">
            <li className="nav-item">
              <NavLink to="/ajout" className={getNavLinkClass}>
                1. Ajouter étudiant
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/liste" className={getNavLinkClass}>
                2. Listage & Mise à jour
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/bilan" className={getNavLinkClass}>
                3. Bilan & Graphe
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* 3. Contenu (Scrollable) */}
        <main className="flex-grow-1 overflow-y-auto p-4 bg-light">
          <Outlet />
        </main>
      </div>

      {/* 4. Footer Fixe */}
      <footer className="bg-white text-center p-2 border-top" style={{ height: '40px' }}>
        <small className="text-muted">Développeurs : Joiecino, Raissa, Nofy</small>
      </footer>
      
    </div>
  );
}