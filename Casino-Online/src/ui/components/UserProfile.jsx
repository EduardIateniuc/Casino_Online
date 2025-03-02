import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Fix incorrect import
import Footer from "../footerRouter";
import api from "../api";


const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initUser = async () => {
      if (!window.Telegram || !window.Telegram.WebApp) {
        console.error("Telegram WebApp API is not available!");
        return;
      }

      const tg = window.Telegram.WebApp.initDataUnsafe.user;
      if (!tg) {
        console.error("No user data available!");
        return;
      }

      const playerData = {
        telegramId: tg.id,
        username: tg.username,
        firstName: tg.first_name,
        lastName: tg.last_name,
        photoUrl: tg.photo_url,
      };

      try {
        const response = await api.post("api/players/telegram-login", playerData);
        setUser(response.data);
      } catch (error) {
        console.error("Error during registration:", error);
      }
    };

    initUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* User Avatar */}
          <img
            src={playerData.photoUrl}
            alt="User Avatar"
            className="w-32 h-32 rounded-full border-4 border-white"
          />
          <p>
            {playerData.username}
          </p>
          {/* Balance */}
          <div className="text-white text-2xl font-bold">
            Баланс: {localStorage.getItem("balance")} фишек
          </div>
          {/* Return to Game Button */}
          <Link to="/">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full">
              Вернуться в игру
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
