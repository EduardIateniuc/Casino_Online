import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../footerRouter";
import api from "../api";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId"); // Assuming you store the user ID after login

      if (!userId) {
        console.error("No user ID found!");
        return;
      }

      try {
        const response = await api.get(`/api/players/${userId}`);
        setUser(response.data);
        setBalance(response.data.balance || 0);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4">
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
            </>
          )}
          <div className="text-white text-2xl font-bold">
            Баланс: {balance} фишек
          </div>
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
