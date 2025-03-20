import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import Footer from "./ui/footerRouter";
import { Plus } from "lucide-react";
import GameSettings from "./ui/components/GameSettings";
import PokerTable from "./ui/components/PokerTable";
import api from "./ui/api";
import "./index.css";

const PokerGame = () => {
  const [playerChips, setPlayerChips] = useState(0);
  const [pot, setPot] = useState(0);
  const [currentBet, setCurrentBet] = useState(10);
  const [gameStage, setGameStage] = useState("preFlop");
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [showSettings, setShowSettings] = useState(true);
  const tg = window.Telegram.WebApp.initDataUnsafe?.user;

  const fetchBalance = useCallback(async () => {
    try {
      const response = await api.get(`api/players/${tg.id}/balance`);
      setPlayerChips(response.data);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }, [tg.id]);

  useEffect(() => {
    if (tg?.id) {
      fetchBalance();
    }
  }, [fetchBalance, tg?.id]);

  const updateBalance = async (amount) => {
    try {
      await api.patch(`api/players/${tg.id}/balance`, null, { params: { amount } });
      fetchBalance();
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  const playerAction = async (action) => {
    let newBalance = playerChips;
    switch (action) {
      case "call":
        newBalance -= currentBet;
        setPot((prev) => prev + currentBet);
        break;
      case "raise":
        const raiseAmount = currentBet * 2;
        newBalance -= raiseAmount;
        setPot((prev) => prev + raiseAmount);
        setCurrentBet(raiseAmount);
        break;
      case "fold":
        setPot(0);
        return;
    }
    await updateBalance(newBalance);
    setIsPlayerTurn(false);
  };

  if (showSettings) {
    return <GameSettings onStartGame={() => setShowSettings(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-4 rounded-full px-6 py-2 bg-black bg-opacity-75 text-white">
          <div className="w-2/5 rounded-full flex items-center gap-2">Balance: {playerChips}</div>
          <Button onClick={() => playerAction("call")} className="bg-green-600 hover:bg-green-700 rounded-full">
            <Plus className="w-7 h-7" />
          </Button>
        </div>
        <PokerTable
          gameStage={gameStage}
          isPlayerTurn={isPlayerTurn}
          onPlayerAction={playerAction}
          currentBet={currentBet}
          playerChips={playerChips}
        />
      </div>
      <Footer />
    </div>
  );
};

export default PokerGame;