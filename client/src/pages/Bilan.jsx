import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Bilan() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/bilan').then(res => setStats(res.data));
  }, []);

  if (!stats) return <div className="container mt-4">Chargement...</div>;

  const data = [
    { name: 'Admis', value: parseInt(stats.admis) },
    { name: 'Redoublants', value: parseInt(stats.redoublants) }
  ];
  const COLORS = ['#0d6efd', '#fd7e14'];

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Bilan de la classe</h2>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body"><h5>Moyenne Classe: {parseFloat(stats.moy_classe).toFixed(2)}</h5></div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success mb-3">
            <div className="card-body"><h5>Moyenne maximum: {stats.max_moy}</h5></div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-dark mb-3">
            <div className="card-body"><h5> Moyenne minimum: {stats.min_moy}</h5></div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}