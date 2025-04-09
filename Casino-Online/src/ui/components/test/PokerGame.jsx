// WebSocket client code for React frontend

import React, { useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX, ChevronDown, History, Plus } from "lucide-react";
import PokerTable from "../PokerTable";
import BetSound from "../../../sounds/bet.mp3";
import Deal from "../../../sounds/deal.mp3";
import Fold from "../../../sounds/fold.mp3";
import Win from "../../../sounds/win.mp3";
import Footer from "../../footerRouter";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "../../../index.css";

const PokerGame = () => {
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [pot, setPot] = useState(0);
  const [playerChips, setPlayerChips] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [gameStage, setGameStage] = useState("waiting");
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(true);
  const [initialBet, setInitialBet] = useState(10);

  const tg = window.Telegram?.WebApp?.initDataUnsafe?.user;

  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new SockJS('/ws');
      const client = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = () => {
        setConnected(true);
        console.log("Connected to WebSocket");
        
        if (gameState?.gameId) {
          client.subscribe(`/topic/games/${gameState.gameId}`, (message) => {
            handleGameUpdate(JSON.parse(message.body));
          });
        }
        
        client.subscribe('/topic/games', (message) => {
          const gamesList = JSON.parse(message.body);
          console.log("Games list:", gamesList);
        
          if (Array.isArray(gamesList) && gamesList.length > 0) {
            setGameState(gamesList[0]);
          }
        });
        
        
        
      };

      client.onDisconnect = () => {
        setConnected(false);
        console.log("Disconnected from WebSocket");
      };

      client.activate();
      setStompClient(client);

      return () => {
        if (client) {
          client.deactivate();
        }
      };
    };

    if (!stompClient) {
      connectWebSocket();
    }
    
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [gameState?.gameId]);

  
  

  const handleGameUpdate = (updatedGameState) => {
    setGameState(updatedGameState);
    
    setCommunityCards(updatedGameState.communityCards);
    setPot(updatedGameState.pot);
    setCurrentBet(updatedGameState.currentBet);
    setGameStage(updatedGameState.gameStage);
    
    if (tg?.id) {
      const player = updatedGameState.players.find(p => p.telegramId === tg.id);
      if (player) {
        setPlayerHand(player.hand);
        setPlayerChips(player.chips);
        setIsPlayerTurn(player.isTurn);
      }
    }
    
    if (updatedGameState.gameStage === "showdown") {
      playSound("win");
    } else if (updatedGameState.gameStage !== gameStage) {
      playSound("deal");
    }
  };

  const joinGame = useCallback(() => {
    if (stompClient && connected && tg?.id) {
      stompClient.publish({
        destination: `/poker/join/${tg.id}`,
        body: JSON.stringify({})
      });
    }
  }, [stompClient, connected, tg]);

  const createGame = useCallback((numPlayers, initialBet) => {
    if (stompClient && connected && tg?.id) {
      stompClient.publish({
        destination: '/app/poker/create',
        body: JSON.stringify({
          telegramId: tg.id,
          initialBet: initialBet
        })
      });
      setInitialBet(initialBet);
      setShowSettings(false);
    }
  }, [stompClient, connected, tg]);
  

  const playerAction = useCallback((action, amount = 0) => {
    if (stompClient && connected && gameState?.gameId && tg?.id) {
      if (action === "call" || action === "raise" || action === "fold") {
        playSound(action === "fold" ? "fold" : "bet");
        
        stompClient.publish({
          destination: `/app/poker/action/${gameState.gameId}`,
          body: JSON.stringify({
            telegramId: tg.id,
            action: action,
            amount: amount
          })
        });
      }
    }
  }, [stompClient, connected, gameState, tg]);

  const leaveGame = useCallback(() => {
    if (stompClient && connected && gameState?.gameId && tg?.id) {
      stompClient.publish({
        destination: `/app/poker/leave/${gameState.gameId}`,
        body: JSON.stringify(tg.id)
      });
      setGameState(null);
      setShowSettings(true);
    }
  }, [stompClient, connected, gameState, tg]);

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
      audio.play().catch((e) => console.log("Sound play error:", e));
    }
  }, [isSoundEnabled]);

  useEffect(() => {
    if (connected && tg?.id && !gameState && !showSettings) {
      joinGame();
    }
  }, [connected, tg, gameState, showSettings, joinGame]);


  const startGame = useCallback((numPlayers, initialBetAmount) => {
    setInitialBet(initialBetAmount);
    setShowSettings(false);
    createGame(numPlayers, initialBetAmount);
  }, [createGame]);

  useEffect(() => {
    if (connected && tg?.id && !gameState && !showSettings) {
      joinGame();
    }
  }, [connected, tg, gameState, showSettings, joinGame]);



  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-4 rounded-full px-6 py-2 bg-black bg-opacity-75 text-white">
          <div className="w-2/5 rounded-full flex items-center gap-2">
            Balance: {playerChips}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="bg-transparent hover:bg-gray-700"
            >
              {isSoundEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={leaveGame}
              className="bg-red-600 hover:bg-red-700"
            >
              Leave Game
            </button>
          </div>
        </div>
        
        {gameState && (
          <PokerTable
            gameState={gameState}
            playerTelegramId={tg?.id}
            communityCards={communityCards}
            playerHand={playerHand}
            isPlayerTurn={isPlayerTurn}
            onPlayerAction={playerAction}
            currentBet={currentBet}
            playerChips={playerChips}
          />
        )}
        
        {!gameState && (
          <div className="text-center p-10 bg-black bg-opacity-50 text-white rounded-lg">
            <h2 className="text-xl mb-4">Waiting for game...</h2>
            <button onClick={joinGame} className="bg-green-600 hover:bg-green-700">
              Join Available Game
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PokerGame;