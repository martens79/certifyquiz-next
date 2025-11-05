import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLabel } from "../utils/langUtils";
import { api } from "../services/api"; // ✅ usa axios con baseURL = VITE_API_URL (/api in prod)

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get("/leaderboard"); // 👈 niente /api qui
        const items = Array.isArray(data) ? data : data?.items || [];
        setLeaders(items);
      } catch (err) {
        console.error("Errore nel caricamento classifica:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 text-gray-800 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">
          🏆 {getLabel({
            it: "Classifica Utenti",
            en: "User Leaderboard",
            fr: "Classement des utilisateurs",
            es: "Clasificación de usuarios",
          })}
        </h1>

        {loading ? (
          <p className="text-center">
            {getLabel({
              it: "Caricamento...",
              en: "Loading...",
              fr: "Chargement...",
              es: "Cargando...",
            })}
          </p>
        ) : leaders.length === 0 ? (
          <p className="text-center">
            {getLabel({
              it: "Nessun dato disponibile.",
              en: "No data available.",
              fr: "Aucune donnée disponible.",
              es: "No hay datos disponibles.",
            })}
          </p>
        ) : (
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="bg-orange-300 text-white">
                <th className="text-left px-3 py-2">#</th>
                <th className="text-left px-3 py-2">
                  {getLabel({
                    it: "Username",
                    en: "Username",
                    fr: "Nom d'utilisateur",
                    es: "Nombre de usuario",
                  })}
                </th>
                <th className="text-right px-3 py-2">
                  {getLabel({
                    it: "Punti",
                    en: "Points",
                    fr: "Points",
                    es: "Puntos",
                  })}
                </th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((u, index) => (
                <tr key={u.id ?? `${u.username}-${index}`} className="border-b">
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2">{u.username}</td>
                  <td className="px-3 py-2 text-right">{u.total_points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/profile"
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {getLabel({
              it: "Torna al profilo",
              en: "Back to profile",
              fr: "Retour au profil",
              es: "Volver al perfil",
            })}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
