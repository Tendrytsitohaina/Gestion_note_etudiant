'use client';
import { useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';

export default function LoginPage() {
  const [creds, setCreds] = useState({ username: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/login`, creds);
      alert(res.data.message);
      // Redirection après succès...
    } catch (err) {
      alert("Erreur de connexion"+ err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow-md rounded">
        <h2 className="text-2xl mb-4">Connexion</h2>
        <input className="border p-2 w-full mb-2" placeholder="Utilisateur" onChange={(e)=>setCreds({...creds, username: e.target.value})} />
        <input className="border p-2 w-full mb-4" type="password" placeholder="Mot de passe" onChange={(e)=>setCreds({...creds, password: e.target.value})} />
        <button type="submit" className="bg-blue-500 text-white w-full p-2">Se connecter</button>
      </form>
    </div>
  );
}