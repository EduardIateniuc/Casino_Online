import React from "react";
import { User, Gamepad, List } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="w-full left-0 right-0 bg-gray-500 backdrop-blur-lg bottom-0 fixed py-3 shadow-lg">
      <div className="flex justify-center items-center space-x-20">
        
        <Link to={"/game"}>
        <div className="flex flex-col text-white items-center cursor-pointer hover:text-green-600 transition-colors duration-200">
          <Gamepad className="w-8 h-8" />
          <span className="text-sm mt-1">Игра</span>
        </div>
        </Link>

        <Link to={"/"}>
        <div className="flex flex-col text-white items-center cursor-pointer hover:text-blue-600 transition-colors duration-200">
          <User className="w-8 h-8" />
          <span className="text-sm mt-1">Профиль</span>
        </div>
        </Link>

        <Link to={"/history"}>
        <div className="flex flex-col text-white items-center cursor-pointer hover:text-purple-600 transition-colors duration-200">
          <List className="w-8 h-8" />
          <span className="text-sm mt-1">История</span>
        </div>
        </Link>
      </div>
    </div>
  );
};

export default Footer;