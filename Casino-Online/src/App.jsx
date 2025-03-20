import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
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
  const [playerChips, setPlayerChips] = useState(1000);
  const [computerChips, setComputerChips] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [gameStage, setGameStage] = useState("preFlop");
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameHistory, setGameHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [dealAnimation, setDealAnimation] = useState(false);
  const [numBots, setNumBots] = useState(1);
  const [initialBet, setInitialBet] = useState(10);
  const [showSettings, setShowSettings] = useState(true);

  const tg = window.Telegram?.WebApp?.initDataUnsafe?.user;

  const updateBalance = async (playerId, amount) => {
    try {
      const response = await api.patch(
        `/api/players/${playerId}/balance`,
        { amount },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      setPlayerChips(response.data.balance);
      return response.data.balance;
    } catch (error) {
      console.error("Error updating balance:", error);
      return null;
    }
  };

  const getBalance = async (playerId) => {
    try {
      const response = await api.get(`/api/players/${playerId}/balance`);
      setPlayerChips(response.data.balance);
      return response.data.balance;
    } catch (error) {
      console.error("Error fetching balance:", error);
      return 1000; // Default value in case of error
    }
  };

  const shuffleDeck = useCallback(() => {
    const newDeck = SUITS.flatMap(suit => 
      VALUES.map(value => ({ suit, value }))
    );
    
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
  }, []);

  const dealCards = useCallback(() => {
    const newDeck = shuffleDeck();
    const playerHand = [newDeck.pop(), newDeck.pop()];
    const newBotHands = Array.from({ length: numBots }, () => [
      newDeck.pop(),
      newDeck.pop(),
    ]);

    setDeck(newDeck);
    setPlayerHand(playerHand);
    setBotHands(newBotHands);
    setCommunityCards([]);
    setPot(initialBet * (numBots + 1));
    setCurrentBet(initialBet);
    setGameStage("preFlop");
    setIsPlayerTurn(true);
  }, [numBots, initialBet, shuffleDeck]);

  const startGame = useCallback(async (numBots, initialBet) => {
    setNumBots(numBots);
    setInitialBet(initialBet);
    if (tg?.id) {
      const balance = await getBalance(tg.id);
      setPlayerChips(balance);
    }
    setShowSettings(false);
  }, [tg]);

  const evaluateHand = useCallback((cards) => {
    const allCards = [...cards];
    const values = allCards.map((card) => CARD_VALUES[card.value]);
    const suits = allCards.map((card) => card.suit);

    const isFlush = suits.every((suit) => suit === suits[0]);
    const sortedValues = [...new Set(values)].sort((a, b) => a - b);
    const isStraight = sortedValues.length >= 5 && 
      sortedValues[sortedValues.length - 1] - sortedValues[0] === sortedValues.length - 1;

    const valueCounts = values.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

    const pairs = Object.values(valueCounts).filter(count => count === 2).length;
    const threes = Object.values(valueCounts).filter(count => count === 3).length;
    const fours = Object.values(valueCounts).filter(count => count === 4).length;

    if (isFlush && isStraight) return { rank: 9, name: "Straight Flush" };
    if (fours > 0) return { rank: 8, name: "Four of a Kind" };
    if (threes > 0 && pairs > 0) return { rank: 7, name: "Full House" };
    if (isFlush) return { rank: 6, name: "Flush" };
    if (isStraight) return { rank: 5, name: "Straight" };
    if (threes > 0) return { rank: 4, name: "Three of a Kind" };
    if (pairs === 2) return { rank: 3, name: "Two Pairs" };
    if (pairs === 1) return { rank: 2, name: "Pair" };
    return { rank: 1, name: "High Card" };
  }, []);

  const playSound = useCallback((soundType) => {
    if (!isSoundEnabled) return;
    const sounds = {
      deal: Deal,
      win: Win,
      bet: BetSound,
      fold: Fold,
    };
    if (sounds[soundType]) {
      const audio = new Audio(sounds[soundType]);
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Sound play error:", e));
    }
  }, [isSoundEnabled]);

  const determineWinner = useCallback(async () => {
    if (!tg?.id) return;

    const playerHandStrength = evaluateHand([...playerHand, ...communityCards]);
    const botHandStrengths = botHands.map(hand => 
      evaluateHand([...hand, ...communityCards])
    );

    const maxBotRank = Math.max(...botHandStrengths.map(h => h.rank));
    let winner, winningHand;

    if (playerHandStrength.rank > maxBotRank) {
      winner = "Player";
      winningHand = playerHandStrength.name;
      const newBalance = playerChips + pot;
      if (tg?.id) {
        await updateBalance(tg.id, newBalance);
      }
      setPlayerChips(newBalance);
    } else {
      winner = "Computer";
      winningHand = botHandStrengths[0].name;
      setComputerChips(prev => prev + pot);
    }

    playSound("win");
    setGameHistory(prev => [{
      winner,
      pot,
      winningHand,
      date: new Date().toLocaleString(),
    }, ...prev]);

    setTimeout(dealCards, 2000);
  }, [playerHand, botHands, communityCards, pot, dealCards, evaluateHand, playSound, playerChips, tg]);

  const progressGame = useCallback(() => {
    setDealAnimation(true);
    let newCommunityCards;
    switch (gameStage) {
      case "preFlop":
        newCommunityCards = [deck.pop(), deck.pop(), deck.pop()];
        setCommunityCards(newCommunityCards);
        setGameStage("flop");
        break;
      case "flop":
        newCommunityCards = [...communityCards, deck.pop()];
        setCommunityCards(newCommunityCards);
        setGameStage("turn");
        break;
      case "turn":
        newCommunityCards = [...communityCards, deck.pop()];
        setCommunityCards(newCommunityCards);
        setGameStage("river");
        break;
      case "river":
        setGameStage("showdown");
        determineWinner();
        break;
    }
    setTimeout(() => setDealAnimation(false), 500);
  }, [gameStage, deck, communityCards, determineWinner]);

  const computerAI = useCallback(() => {
    if (!isPlayerTurn) {
      const handStrength = evaluateHand([...botHands[0], ...communityCards]);
      setTimeout(() => {
        if (handStrength.rank >= 4) {
          playerAction("raise", false);
        } else if (handStrength.rank >= 2) {
          playerAction("call", false);
        } else {
          playerAction(Math.random() > 0.7 ? "fold" : "call", false);
        }
      }, Math.random() * 1000 + 500);
    }
  }, [isPlayerTurn, botHands, communityCards, evaluateHand]);

  const playerAction = useCallback(async (action, isPlayer = true) => {
    if (!tg?.id && isPlayer) return;

    playSound("bet");
    let newPlayerChips = playerChips;
    let newComputerChips = computerChips;

    switch (action) {
      case "call":
        if (isPlayer) {
          newPlayerChips -= currentBet;
          await updateBalance(tg.id, newPlayerChips);
          setPlayerChips(newPlayerChips);
        } else {
          newComputerChips -= currentBet;
          setComputerChips(newComputerChips);
        }
        setPot(prev => prev + currentBet);
        break;

      case "raise":
        const raiseAmount = currentBet * 2;
        if (isPlayer) {
          newPlayerChips -= raiseAmount;
          await updateBalance(tg.id, newPlayerChips);
          setPlayerChips(newPlayerChips);
        } else {
          newComputerChips -= raiseAmount;
          setComputerChips(newComputerChips);
        }
        setPot(prev => prev + raiseAmount);
        setCurrentBet(raiseAmount);
        break;

      case "fold":
        playSound("fold");
        if (isPlayer) {
          setComputerChips(prev => prev + pot);
        } else {
          newPlayerChips += pot;
          await updateBalance(tg.id, newPlayerChips);
          setPlayerChips(newPlayerChips);
        }
        dealCards();
        return;
    }

    setIsPlayerTurn(!isPlayer);
    if (!isPlayer) progressGame();
  }, [currentBet, pot, playerChips, computerChips, dealCards, progressGame, playSound, tg]);

  useEffect(() => {
    if (!showSettings && deck.length === 0) {
      dealCards();
    }
  }, [showSettings, dealCards, deck]);

  useEffect(() => {
    if (!isPlayerTurn) computerAI();
  }, [isPlayerTurn, computerAI]);

  if (showSettings) {
    return <GameSettings onStartGame={startGame} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-4 rounded-full px-6 py-2 bg-black bg-opacity-75 text-white">
          <div className="w-2/5 rounded-full flex items-center gap-2">
            Balance: {playerChips}
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
      </div>
    </div>
  );
};

export default PokerGame;