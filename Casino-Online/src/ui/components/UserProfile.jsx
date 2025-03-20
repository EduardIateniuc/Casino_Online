import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../footerRouter";
import api from "../api";
import { Loader2, AlertCircle, Wallet, ArrowRight, UserCircle } from "lucide-react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initUser = async () => {
      if (!window.Telegram || !window.Telegram.WebApp) {
        console.error("Telegram WebApp API is not available!");
        setError("Telegram WebApp API недоступен");
        setLoading(false);
        return;
      }

      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();

      const tg = window.Telegram.WebApp.initDataUnsafe?.user;
      if (!tg) {
        console.error("No user data available!");
        setError("Данные пользователя недоступны");
        setLoading(false);
        return;
      }

      try {
        // Проверяем, есть ли пользователь в базе
        const response = await api.get(`/api/players/${tg.id}`);
        setUser(response.data);
        setBalance(response.data.balance || 0);

        localStorage.setItem("userId", response.data.telegramId);
        localStorage.setItem("balance", response.data.balance || 0);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("Пользователь не найден, регистрируем...");

          const playerData = {
            telegramId: tg.id,
            username: tg.username || "Неизвестный",
            firstName: tg.first_name || "",
            lastName: tg.last_name || "",
            photoUrl: tg.photo_url || "",
          };

          try {
            const registerResponse = await api.post("/api/players/telegram-login", playerData, {
              headers: {
                "Content-Type": "application/json",
              },
            });

            setUser(registerResponse.data);
            setBalance(registerResponse.data.balance || 0);

            localStorage.setItem("userId", registerResponse.data.telegramId);
            localStorage.setItem("balance", registerResponse.data.balance || 0);
            setLoading(false);
          } catch (registerError) {
            console.error("Ошибка при регистрации:", registerError);
            setError("Ошибка при регистрации пользователя");
            setLoading(false);
          }
        } else {
          console.error("Ошибка при получении данных пользователя:", error);
          setError("Ошибка при получении данных пользователя");
          setLoading(false);
        }
      }
    };

    initUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-800 flex items-center justify-center">
        <div className="text-white text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-xl">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-800 flex items-center justify-center">
        <div className="text-white text-center p-8 bg-gray-800 bg-opacity-50 rounded-xl">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <p className="text-xl mb-4">{error}</p>
          <Link to="/">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full">
              Вернуться в игру
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-800 p-4 pb-24">
      <div className="max-w-md mx-auto">
        {/* User Card */}
        <div className="bg-gray-800 bg-opacity-70 rounded-2xl shadow-2xl overflow-hidden mb-6">
          {/* Profile Header */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-green-500 to-emerald-700"></div>
            <div className="absolute bottom-0 left-0 w-full transform translate-y-1/2 flex justify-center">
              <div className="ring-4 ring-gray-800 rounded-full">
                <img
                  src={user?.photoUrl || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-24 h-24 rounded-full border-4 border-white object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-avatar.png";
                  }}
                />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="pt-16 px-6 pb-6">
            <div className="text-center">
              <h2 className="text-white text-xl font-bold">{user?.firstName || "Гость"}</h2>
              <p className="text-green-400 text-sm">@{user?.username || "unknown"}</p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 my-4"></div>

            {/* Balance Display */}
            <div className="bg-gray-900 bg-opacity-60 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Wallet className="w-6 h-6 text-green-500 mr-3" />
                <div>
                  <p className="text-gray-400 text-xs">Текущий баланс</p>
                  <p className="text-white text-xl font-bold">{balance} фишек</p>
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

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-3">
          <Link to="/" className="w-full">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-green-900/30 transition duration-200">
              <Gamepad className="w-5 h-5" />
              <span>Вернуться в игру</span>
            </button>
          </Link>
          <Link to="/balance-income" className="w-full">
            <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-green-900/30 transition duration-200">
              <Wallet className="w-5 h-5" />
              <span>Пополнить баланс</span>
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;