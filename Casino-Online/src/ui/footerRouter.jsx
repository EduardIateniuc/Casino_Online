import React from "react";
import { User, Gamepad, List, Home, Clock, Award } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const getItemClass = (path) => {
    return `flex flex-col items-center cursor-pointer transition-all duration-200 ${
      isActive(path) 
        ? "text-green-400 scale-110" 
        : "text-gray-300 hover:text-white"
    }`;
  };

  return (
    <div className="w-full left-0 right-0 bg-gray-900 bg-opacity-90 backdrop-blur-lg bottom-0 fixed py-3 shadow-lg border-t border-gray-800">
      <div className="max-w-lg mx-auto flex justify-between items-center px-6">
        <Link to="/game">
          <div className={getItemClass("/game")}>
            <Gamepad className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Игра</span>
          </div>
        </Link>

        <Link to="/history">
          <div className={getItemClass("/history")}>
            <Clock className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">История</span>
          </div>
        </Link>
        
        <Link to="/">
          <div className={`${getItemClass("/")} -mt-5`}>
            <div className="bg-green-600 hover:bg-green-700 p-3 rounded-full shadow-lg shadow-green-900/30 transition-all duration-200">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs mt-1 font-medium">Домой</span>
          </div>
        </Link>

        <Link to="/rating">
          <div className={getItemClass("/rating")}>
            <Award className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Рейтинг</span>
          </div>
        </Link>
        
        <Link to="/profile">
          <div className={getItemClass("/profile")}>
            <User className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Профиль</span>
          </div>
        </Link>
      </div>
      
    </div>
  );
};

export default Footer;