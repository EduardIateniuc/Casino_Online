import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import api from '../api';


const HistoryPage = ({ gameHistory }) => {

  const [playerId, setPlayerId] = useState();
  const [games, setGames] = useState();


const fetchGames = async (pot, status, date) =>{

  const tg = window.Telegram?.WebApp?.initDataUnsafe?.user;

  const GameInfo = {
    potDate : pot,
    statusDate : status,
    dateDate : date,
  };

  

  try {
    const response = await api.get(`/api/players/${tg.id}`);
    setPlayerId(response.data.playerId);
    setUser(response.data);
    setBalance(response.data.balance || 0);
  } catch (error) {
    setError("Ошибка загрузки пользователя");
  }

  try{
    const gameResponse = await api.get(`/api/games/${playerId}`);
    setGames(gameResponse.data);
  }catch(error){
    setError("Ошибка загрузки игр");
  }

}
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-white text-3xl font-bold mb-4">История выигрышей</h1>
          {/* Таблица истории */}
          <div className="w-full bg-white bg-opacity-90 rounded-lg shadow-lg p-4">
            {gameHistory.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2">Дата</th>
                    <th className="text-left py-2">Победитель</th>
                    <th className="text-left py-2">Выигрыш</th>
                    <th className="text-left py-2">Комбинация</th>
                  </tr>
                </thead>
                <tbody>
                  {gameHistory.map((entry, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-2">{entry.date}</td>
                      <td className="py-2">{entry.status}</td>
                      <td className="py-2">{entry.pot} фишек</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center text-gray-600">История пуста</div>
            )}
          </div>
          {/* Кнопка возврата в игру */}
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