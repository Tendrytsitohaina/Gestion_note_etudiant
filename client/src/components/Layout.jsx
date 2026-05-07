import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastProvider';

const navItems = [
   {
    to: '/liste',
    label: 'Liste & Mise à jour',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10" /></svg>,
  },
  {
    to: '/ajout',
    label: 'Ajouter un étudiant',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
  },
 
  {
    to: '/bilan',
    label: 'Bilan & Graphe',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17l4-8 4 4 4-6 4 5" /></svg>,
  },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast('Déconnexion réussie.', 'info');
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="h-16 bg-gradient-to-r from-slate-900 to-slate-700 flex items-center justify-between px-6 shadow-lg z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12 12 0 0112 21a12 12 0 01-6.16-10.422L12 14z" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-semibold text-base leading-none tracking-wide">GestNote</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-white text-sm font-medium leading-none">{user?.nom}</p>
            <p className="text-slate-400 text-xs mt-0.5 capitalize">{user?.role}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {user?.nom?.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs transition-colors ml-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <nav className="w-60 bg-slate-900 flex flex-col py-4 px-3 gap-1 shadow-xl">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-3 mb-2">Navigation</p>
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              {icon}
              {label}
            </NavLink>
          ))}

         
          {user?.role === 'admin' && (
            <>
              <div className="my-2 border-t border-slate-800" />
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-3 mb-1">Admin</p>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Créer un compte
              </NavLink>
            </>
          )}

          <div className="mt-auto px-3 pt-4 border-t border-slate-800">
            <p className="text-slate-600 text-xs leading-relaxed">
              Année universitaire<br />
              <span className="text-slate-500 font-medium">2024 – 2025</span>
            </p>
          </div>
        </nav>

        {/* Main */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="p-6 pt-10">
            <Outlet />
          </div>
        </main>
      </div>

      <footer className="h-10 bg-slate-900 border-t border-slate-200 flex items-center justify-center">
        <p className="text-slate-400 text-xs">
          Développé par <span className="font-medium text-slate-600">Joiecino, Raissa & Nofy</span> {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}