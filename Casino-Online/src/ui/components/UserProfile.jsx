import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Fix incorrect import
import Footer from "../footerRouter";

const UserProfile = () => {
  const [avatar, setAvatar] = useState("https://via.placeholder.com/150");

  useEffect(() => {
    // Load user data from local storage or backend (replace with actual method)
    const userData = JSON.parse(localStorage.getItem("telegramUser"));

    if (userData && userData.photo_url) {
      setAvatar(userData.photo_url);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* User Avatar */}
          <img
            src={avatar}
            alt="User Avatar"
            className="w-32 h-32 rounded-full border-4 border-white"
          />
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
