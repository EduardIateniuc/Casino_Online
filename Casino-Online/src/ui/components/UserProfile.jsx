import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../footerRouter";
import { Loader2, AlertCircle, Wallet, ArrowRight, UserCircle } from "lucide-react";
import api from "../api";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const initUser = async () => {
      if (!window.Telegram || !window.Telegram.WebApp) {
        console.error("Telegram WebApp API is not available!");
        return;
      }

      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();

      console.log("Telegram initData:", window.Telegram.WebApp.initData);
      console.log("initDataUnsafe:", window.Telegram.WebApp.initDataUnsafe);

      const tg = window.Telegram.WebApp.initDataUnsafe?.user;
      if (!tg) {
        console.error("No user data available!");
        return;
      }

      try {
        const response = await api.get(`/api/players/${tg.id}`);
        setUser(response.data);
        setBalance(response.data.balance || 0);

        localStorage.setItem("userId", response.data.telegramId);
        localStorage.setItem("balance", response.data.balance || 0);
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
          } catch (registerError) {
            console.error("Ошибка при регистрации:", registerError);
          }
        } else {
          console.error("Ошибка при получении данных пользователя:", error);
        }
      }
    };

    initUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* User Avatar */}
          {user && (
            <>
              <img
                src={user.photoUrl || "/default-avatar.png"}
                alt="User Avatar"
                className="w-32 h-32 rounded-full border-4 border-white"
              />
              <p className="text-white text-lg font-semibold">
                {user.username}
              </p>
              <p className="text-white text-lg font-semibold">
                {user.firstName}
              </p>
            </>
          )}
          {/* Balance */}
          <div className="text-white text-2xl font-bold">
            Баланс: {balance} фишек
          </div>
          {/* Return to Game Button */}
          <Link to="/">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full">
              Вернуться в игру
            </button>
          </Link>

          <Link to="/balance-income">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full">
              Пополнить баланс
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
