import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const HistoryPage = () => {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);

      const tg = window.Telegram?.WebApp?.initDataUnsafe?.user;

      if (!tg || !tg.id) {
        setError("Telegram user data not available");
        setLoading(false);
        return;
      }

      try {
        const gameResponse = await api.get(`/api/games/getGames/${tg.id}`);
        setGames(gameResponse.data || []);
      } catch (err) {
        setError("Ошибка при загрузке игр: " + err.message);
        setGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []); 

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-white text-3xl font-bold mb-4">
            История выигрышей
          </h1>
          <div className="w-full bg-white bg-opacity-90 rounded-lg shadow-lg p-4">
            {loading ? (
              <div className="text-center text-gray-600">Загрузка...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : games.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2">Дата</th>
                    <th className="text-left py-2">Статус</th>
                    <th className="text-left py-2">Ставка</th>
                    <th className="text-left py-2">Комбинация</th>
                  </tr>
                </thead>
                <tbody>
                  {games.map((game, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-2">
                        {new Date(game.created).toLocaleString()}
                      </td>
                      <td className="py-2">{game.status}</td>
                      <td className="py-2">{game.pot} фишек</td>
                      <td className="py-2">{game.combination}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-gray-600">История пуста</div>
            )}
          </div>
          <Link to="/">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full">
              Вернуться в игру
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;