import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../footerRouter";
import {
  Loader2,
  AlertCircle,
  Wallet,
  ArrowRight,
  Clock,
  TrendingUp,
  Gamepad,
  Activity,
} from "lucide-react";
import api from "../api";

const MainPage = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ wins: 0, totalGames: 0, winRate: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      let userId = null;

      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        userId = window.Telegram.WebApp.initDataUnsafe?.user?.id;
      } else {
        userId = localStorage.getItem("userId");
      }

     

        const userResponse = await api.get(`/api/players/${689123242}`);
        setUser(userResponse.data);
        setBalance(userResponse.data.balance || 0);

        const transactionsResponse = {
            description: "income",
            amount: 300,
            date: "",
        }
        setTransactions(transactionsResponse.data || []);

        const statsResponse = {
            wins: 10,
            totalGames: 25,
            winRate: 200,
        };
        setStats(statsResponse.data || { wins: 0, totalGames: 0, winRate: 0 });
      
    };

    fetchUserData();
  }, []);



  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-800 flex items-center justify-center">
        <div className="text-white text-center p-8 bg-gray-800 bg-opacity-50 rounded-xl">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <p className="text-xl mb-4">{error}</p>
          <Link to="/profile">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full">
              Перейти в профиль
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date
      .toLocaleTimeString()
      .slice(0, 5)}`;
  };

  const getTransactionDetails = (type) => {
    switch (type) {
      case "deposit":
        return {
          icon: <TrendingUp className="w-5 h-5 text-green-400" />,
          color: "text-green-400",
        };
      case "withdrawal":
        return {
          icon: <ArrowRight className="w-5 h-5 text-red-400" />,
          color: "text-red-400",
        };
      case "win":
        return {
          icon: <TrendingUp className="w-5 h-5 text-green-400" />,
          color: "text-green-400",
        };
      case "loss":
        return {
          icon: <ArrowRight className="w-5 h-5 text-red-400" />,
          color: "text-red-400",
        };
      default:
        return {
          icon: <Clock className="w-5 h-5 text-gray-400" />,
          color: "text-gray-400",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-800 p-4 pb-24">
      <div className="max-w-md mx-auto">
        <div className="bg-gray-800 bg-opacity-70 rounded-2xl shadow-2xl overflow-hidden mb-6">
          <div className="relative">
            <div className="h-20 bg-gradient-to-r from-green-500 to-emerald-700"></div>
            <div className="px-6 py-4">
              <div className="flex items-center">
                <div>
                  <h2 className="text-white text-xl font-bold">
                    Привет, {user?.firstName || "Игрок"}!
                  </h2>
                  <p className="text-green-400 text-sm">
                    Добро пожаловать в игру
                  </p>
                </div>
                <div className="ml-auto">
                  <Link to="/profile">
                    <img
                      src={user?.photoUrl || "/default-avatar.png"}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full border-2 border-white object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-70 rounded-2xl shadow-2xl overflow-hidden mb-6">
          <div className="px-6 py-5">
            <div className="bg-gray-900 bg-opacity-60 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="w-6 h-6 text-green-500 mr-3" />
                <div>
                  <p className="text-gray-400 text-xs">Текущий баланс</p>
                  <p className="text-white text-xl font-bold">{balance} $</p>
                </div>
              </div>
              <Link to="/balance-income">
                <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-70 rounded-2xl shadow-2xl overflow-hidden mb-6">
          <div className="px-6 py-4">
            <h3 className="text-white text-lg font-semibold mb-3">
              Ваша статистика
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-900 bg-opacity-60 rounded-xl p-3 text-center">
                <p className="text-green-400 text-lg font-bold">{stats.wins}</p>
                <p className="text-gray-400 text-xs">Победы</p>
              </div>
              <div className="bg-gray-900 bg-opacity-60 rounded-xl p-3 text-center">
                <p className="text-white text-lg font-bold">
                  {stats.totalGames}
                </p>
                <p className="text-gray-400 text-xs">Всего игр</p>
              </div>
              <div className="bg-gray-900 bg-opacity-60 rounded-xl p-3 text-center">
                <p className="text-green-400 text-lg font-bold">
                  {stats.winRate}%
                </p>
                <p className="text-gray-400 text-xs">Винрейт</p>
              </div>
            </div>
          </div>
        </div>


        <div className="bg-gray-800 bg-opacity-70 rounded-2xl shadow-2xl overflow-hidden mb-6">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white text-lg font-semibold">
                История транзакций
              </h3>
              <Link to="/transactions" className="text-green-400 text-sm">
                Все транзакции
              </Link>
            </div>

            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction, index) => {
                  const { icon, color } = getTransactionDetails(
                    transaction.type
                  );
                  return (
                    <div
                      key={index}
                      className="bg-gray-900 bg-opacity-60 rounded-xl p-3 flex items-center"
                    >
                      <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                        {icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm">
                          {transaction.description}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                      <div className={`text-md font-bold ${color}`}>
                        {transaction.amount > 0 ? "+" : ""}
                        {transaction.amount} $
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-gray-900 bg-opacity-60 rounded-xl p-4 text-center">
                <p className="text-gray-400">Транзакций пока нет</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link to="/game" className="w-full">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-green-900/30 transition duration-200">
              <Gamepad className="w-5 h-5" />
              <span>Играть</span>
            </button>
          </Link>
          <Link to="/balance-income" className="w-full">
            <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-green-900/30 transition duration-200">
              <Wallet className="w-5 h-5" />
              <span>Пополнить</span>
            </button>
          </Link>
        </div>

        <div className="bg-gray-800 bg-opacity-70 rounded-2xl shadow-2xl overflow-hidden mb-6">
          <div className="px-6 py-5">
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="w-6 h-6 text-white mr-3" />
                <div>
                  <p className="text-white text-xs">Ежедневный бонус</p>
                  <p className="text-white text-xl font-bold">+50 $</p>
                </div>
              </div>
              <button className="bg-white text-green-700 px-4 py-2 rounded-full font-medium text-sm">
                Получить
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;
