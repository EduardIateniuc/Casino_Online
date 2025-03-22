import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../footerRouter";
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

  // Helper function to determine status badge color
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case "win":
      case "выигрыш":
        return "bg-green-500";
      case "loss":
      case "проигрыш":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-center mb-2">
            <h1 className="text-white text-4xl font-bold">
              История выигрышей
            </h1>
            <div className="h-1 w-32 bg-green-500 mx-auto mt-2 rounded-full"></div>
          </div>
          
          <div className="w-full bg-gray-800 bg-opacity-80 rounded-xl shadow-2xl overflow-hidden border border-green-600">
            <div className="p-6">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-400 p-4 bg-red-900 bg-opacity-30 rounded-lg">
                  <span className="text-xl">⚠️</span> {error}
                </div>
              ) : games.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-green-700 text-green-300">
                        <th className="text-left py-3 px-4">Дата</th>
                        <th className="text-left py-3 px-4">Статус</th>
                        <th className="text-left py-3 px-4">Ставка</th>
                        <th className="text-left py-3 px-4">Комбинация</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-100">
                      {games.map((game, index) => (
                        <tr key={index} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                          <td className="py-3 px-4">
                            {new Date(game.created).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(game.status)}`}>
                              {game.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium">{game.pot}</span> 
                            <span className="text-green-400 ml-1">фишек</span>
                          </td>
                          <td className="py-3 px-4 font-mono">{game.combination}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-12">
                  <div className="text-4xl mb-2">🎮</div>
                  <p>История пуста. Сыграйте свою первую игру!</p>
                </div>
              )}
            </div>
          </div>
          
          <Link to="/">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Вернуться в игру
            </button>
          </Link>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default HistoryPage;