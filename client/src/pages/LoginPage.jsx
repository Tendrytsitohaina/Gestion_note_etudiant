import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/login', creds);
      setMessage("Connexion réussie !");
      setTimeout(() => navigate('/ajout'), 1000);
    } catch (err) {
      setMessage("Identifiants incorrects.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow" style={{ width: '350px' }}>
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Connexion</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input className="form-control" placeholder="Utilisateur" onChange={(e)=>setCreds({...creds, username: e.target.value})} />
            </div>
            <div className="mb-3">
              <input className="form-control" type="password" placeholder="Mot de passe" onChange={(e)=>setCreds({...creds, password: e.target.value})} />
            </div>
            <button className="btn btn-primary w-100">Se connecter</button>
          </form>
          {message && <p className="mt-3 text-center text-danger">{message}</p>}
        </div>
      </div>
    </div>
  );
}