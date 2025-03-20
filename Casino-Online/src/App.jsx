import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import Footer from "./ui/footerRouter";
import { Volume2, VolumeX, ChevronDown, History, Plus } from "lucide-react";
import GameSettings from "./ui/components/GameSettings";
import PokerTable from "./ui/components/PokerTable";
import BetSound from "./sounds/bet.mp3";
import Deal from "./sounds/deal.mp3";
import Fold from "./sounds/fold.mp3";
import Win from "./sounds/win.mp3";
import "./index.css";
import api from "./ui/api";

const SUITS = ["♠", "♣", "♥", "♦"];
const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const CARD_VALUES = {
  2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10,
  J: 11, Q: 12, K: 13, A: 14,
};

const PokerGame = () => {
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [botHands, setBotHands] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [pot, setPot] = useState(0);
  const [playerChips, setPlayerChips] = useState(0); // Initialize as 0
  const [computerChips, setComputerChips] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [gameStage, setGameStage] = useState("preFlop");
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameHistory, setGameHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [dealAnimation, setDealAnimation] = useState(false);
  const [numBots, setNumBots] = useState(1);
  const [initialBet, setInitialBet] = useState(10);
  const [showSettings, setShowSettings] = useState(true);

  const tg = window.Telegram.WebApp.initDataUnsafe?.user;

  // Fetch initial balance when component mounts
  useEffect(() => {
    if (tg?.id) {
      fetchBalance(tg.id);
    }
  }, [tg?.id]);

  const fetchBalance = async (playerId) => {
    try {
      const response = await api.get(`/api/players/${playerId}/balance`);
      setPlayerChips(response.data.balance); // Set the balance value directly
      return response.data.balance;
    } catch (error) {
      console.error("Error fetching balance:", error);
      return 0;
    }
  };

  const updateBalance = async (playerId, amount) => {
    try {
      const response = await api.patch(
        `/api/players/${playerId}/balance`,
        null,
        {
          params: { amount: amount }
        }
      );
      setPlayerChips(response.data.balance); // Update state with new balance
      return response.data.balance;
    } catch (error) {
      console.error("Error updating balance:", error);
      return playerChips;
    }
  };

  // Rest of your existing functions (shuffleDeck, dealCards, etc.) remain unchanged

  const determineWinner = useCallback(async () => {
    if (!tg || !tg.id) return;

    const playerHandStrength = evaluateHand([...playerHand, ...communityCards]);
    const computerHandStrength = botHands.map((hand) =>
      evaluateHand([...hand, ...communityCards])
    );

    let winner, winningHand;

    if (
      playerHandStrength.rank >
      Math.max(...computerHandStrength.map((h) => h.rank))
    ) {
      winner = "Игрок";
      winningHand = playerHandStrength.name;
      const newBalance = pot; // Add pot to current balance
      await updateBalance(tg.id, newBalance);
    } else {
      winner = "Компьютер";
      winningHand = computerHandStrength[0].name;
      setComputerChips((prev) => prev + pot);
    }

    playSound("win");
    setGameHistory((prev) => [
      {
        winner,
        pot,
        winningHand,
        date: new Date().toLocaleString(),
      },
      ...prev,
    ]);

    setTimeout(dealCards, 2000);
  }, [
    playerHand,
    botHands,
    communityCards,
    pot,
    dealCards,
    evaluateHand,
    playSound,
    playerChips,
  ]);

  const playerAction = useCallback(
    async (action, isPlayer = true) => {
      if (!tg || !tg.id) return;

      playSound("bet");
      
      let amountToUpdate;

      switch (action) {
        case "call":
          amountToUpdate = -currentBet;
          if (isPlayer) {
            await updateBalance(tg.id, amountToUpdate);
          } else {
            setComputerChips((prev) => prev - currentBet);
          }
          setPot((prev) => prev + currentBet);
          break;

        case "raise":
          const raiseAmount = currentBet * 2;
          amountToUpdate = -raiseAmount;
          if (isPlayer) {
            await updateBalance(tg.id, amountToUpdate);
          } else {
            setComputerChips((prev) => prev - raiseAmount);
          }
          setPot((prev) => prev + raiseAmount);
          setCurrentBet(raiseAmount);
          break;

        case "fold":
          playSound("fold");
          if (isPlayer) {
            setComputerChips((prev) => prev + pot);
          } else {
            await updateBalance(tg.id, pot);
          }
          dealCards();
          return;
      }

      setIsPlayerTurn(!isPlayer);
      if (!isPlayer) {
        progressGame();
      }
    },
    [currentBet, pot, dealCards, progressGame, playSound, playerChips]
  );

  // Rest of your existing effects remain unchanged

  if (showSettings) {
    return <GameSettings onStartGame={startGame} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Верхняя панель */}
        <div className="flex justify-between mb-4 rounded-full px-6 py-2 bg-black bg-opacity-75 text-white">
          <div className="w-2/5 rounded-full flex items-center gap-2">
            Balance: {playerChips} {/* Display the actual balance */}
          </div>

          <Button
            onClick={() => playerAction("call")}
            className="bg-green-600 hover:bg-green-700 rounded-full"
          >
            <Plus className="w-7 h-7" />
          </Button>
        </div>
        <PokerTable
          numBots={numBots}
          botHands={botHands}
          gameStage={gameStage}
          communityCards={communityCards}
          playerHand={playerHand}
          isPlayerTurn={isPlayerTurn}
          onPlayerAction={playerAction}
          currentBet={currentBet}
          playerChips={playerChips}
        />

        {showHistory && <GameHistory />}
        {isMultiplayer && <MultiplayerRoom />}
      </div>

      <Footer />
    </div>
  );
};

export default PokerGame;