import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import API_URL from "../config";

const COLORS = ["#3b82f6", "#f97316"];

export default function Bilan() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/bilan`).then((res) => setStats(res.data));
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        Chargement du bilan...
      </div>
    );
  }

  const data = [
    { name: "Admis", value: parseInt(stats.admis) },
    { name: "Redoublants", value: parseInt(stats.redoublants) },
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const statCards = [
    {
      label: "Moyenne de classe",
      value: parseFloat(stats.moy_classe).toFixed(2),
      sub: "sur 20",
      color: "bg-blue-100 border-blue-200",
      valueColor: "text-blue-600",
      icon: (
        <svg
          className="w-5 h-5 text-blue-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      label: "Meilleure moyenne",
      value: parseFloat(stats.max_moy).toFixed(2),
      sub: "maximum",
      color: "bg-emerald-100 border-emerald-200",
      valueColor: "text-emerald-600",
      icon: (
        <svg
          className="w-5 h-5 text-emerald-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      ),
    },
    {
      label: "Moyenne la plus basse",
      value: parseFloat(stats.min_moy).toFixed(2),
      sub: "minimum",
      color: "bg-red-100 border-red-200",
      valueColor: "text-red-500",
      icon: (
        <svg
          className="w-5 h-5 text-red-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Titre */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Bilan de la classe
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          {total} étudiant(s) au total
        </p>
      </div>

      {/* Cartes stats */}
      <div className="grid grig-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl border min-h-[140px] p-4 ${card.color}`}
          >
            <div className="flex items-center gap-2 mb-3">
              {card.icon}
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.label}
              </span>
            </div>
            <div className={`text-3xl font-bold ${card.valueColor}`}>
              {card.value}
            </div>
            <div className="text-xs text-slate-400 mt-1">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Graphique + légende */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
          Répartition admis / redoublants
        </h3>

        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Pie chart */}
          <div className="w-full lg:flex-1 h-[260px] sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} étudiant(s)`, ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats texte */}
          <div className="flex flex-col gap-4 min-w-32">
            <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">
                {stats.admis}
              </div>
              <div className="text-xs text-slate-500 mt-1">Admis</div>
              <div className="text-xs text-blue-400 font-medium">
                {total > 0
                  ? ((parseInt(stats.admis) / total) * 100).toFixed(0)
                  : 0}
                %
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div className="text-2xl font-bold text-orange-500">
                {stats.redoublants}
              </div>
              <div className="text-xs text-slate-500 mt-1">Redoublants</div>
              <div className="text-xs text-orange-400 font-medium">
                {total > 0
                  ? ((parseInt(stats.redoublants) / total) * 100).toFixed(0)
                  : 0}
                %
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
