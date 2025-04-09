import React from "react";
import { Button } from "../button";

const Card = ({ card, hidden = false }) => {
  if (hidden) {
    return (
      <div className="w-16 h-24 bg-gray-800 border-2 border-gray-700 rounded-lg shadow-lg m-1 flex items-center justify-center">
        <div className="w-12 h-16 bg-blue-900 rounded-md"></div>
      </div>
    );
  }

  const isRed = card?.suit === "♥" || card?.suit === "♦";
  
  return (
    <div className="w-16 h-24 bg-white border-2 border-gray-300 rounded-lg shadow-lg m-1 flex flex-col">
      <div className={`p-1 font-bold text-left ${isRed ? "text-red-600" : "text-black"}`}>
        {card?.value}
      </div>
      <div className={`text-center text-2xl ${isRed ? "text-red-600" : "text-black"}`}>
        {card?.suit}
      </div>
    </div>
  );
};

const PokerTable = ({
  gameState,
  playerTelegramId,
  communityCards,
  playerHand,
  isPlayerTurn,
  onPlayerAction,
  currentBet,
  playerChips
}) => {
  // Find opponents (other players in the game)
  const opponents = gameState?.players.filter(
    (player) => player.telegramId !== playerTelegramId
  ) || [];
  
  // Determine if the player has folded
  const playerFolded = gameState?.players.find(
    p => p.telegramId === playerTelegramId
  )?.hasFolded || false;
  
  // Get player's hand evaluation (if available)
  const handEvaluation = gameState?.playerHandEvaluations?.[playerTelegramId]?.name || "";
  
  return (
    <div className="relative">
      {/* Pot and Game Stage */}
      <div className="absolute top-2 left-0 right-0 text-center text-white">
        <div className="bg-black bg-opacity-75 rounded-full px-6 py-2 inline-block">
          <span className="font-bold">Pot: {gameState?.pot || 0}</span>
          {handEvaluation && (
            <span className="ml-4">Hand: {handEvaluation}</span>
          )}
        </div>
        <div className="mt-2 text-lg">
          {gameState?.gameStage === "preFlop" && "Pre-Flop"}
          {gameState?.gameStage === "flop" && "Flop"}
          {gameState?.gameStage === "turn" && "Turn"}
          {gameState?.gameStage === "river" && "River"}
          {gameState?.gameStage === "showdown" && "Showdown"}
          {gameState?.gameStage === "waiting" && "Waiting for Players"}
        </div>
      </div>

      {/* Poker Table */}
      <div className="w-full h-96 bg-green-800 border-8 border-brown-800 rounded-full flex flex-col items-center justify-between p-4 mt-12">
        {/* Opponents */}
        <div className="flex justify-center w-full gap-4 mt-4">
          {opponents.map((opponent, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="mb-2 text-white text-sm">
                {opponent.username} ({opponent.chips})
                {opponent.isTurn && <span className="ml-2 text-yellow-300">⏳</span>}
              </div>
              <div className="flex">
                {opponent.hasFolded ? (
                  <div className="text-white opacity-60">Folded</div>
                ) : (
                  <>
                    {/* Show cards during showdown, otherwise hidden */}
                    {gameState?.gameStage === "showdown" ? (
                      opponent.hand?.map((card, i) => (
                        <Card key={i} card={card} />
                      ))
                    ) : (
                      <>
                        <Card hidden={true} />
                        <Card hidden={true} />
                      </>
                    )}
                  </>
                )}
              </div>
              {opponent.currentBet > 0 && (
                <div className="mt-2 text-white text-sm">
                  Bet: {opponent.currentBet}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Community Cards */}
        <div className="flex justify-center my-6">
          {communityCards && communityCards.length > 0 ? (
            communityCards.map((card, index) => (
              <Card key={index} card={card} />
            ))
          ) : (
            <div className="text-white text-opacity-50">
              {gameState?.gameStage === "waiting"
                ? "Waiting for more players..."
                : "Community cards will appear here"}
            </div>
          )}
        </div>

        {/* Player's Hand */}
        <div className="flex flex-col items-center">
          {playerFolded ? (
            <div className="text-white mb-2">You folded</div>
          ) : (
            <div className="flex mb-2">
              {playerHand.map((card, index) => (
                <Card key={index} card={card} />
              ))}
            </div>
          )}

          {/* Action Buttons */}
          {isPlayerTurn && !playerFolded && gameState?.gameStage !== "showdown" && (
            <div className="flex gap-2 mt-2">
              <Button
                onClick={() => onPlayerAction("fold")}
                className="bg-red-600 hover:bg-red-700"
              >
                Fold
              </Button>
              <Button
                onClick={() => onPlayerAction("call")}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={playerChips < currentBet}
              >
                {currentBet > 0 ? `Call (${currentBet})` : "Check"}
              </Button>
              <Button
                onClick={() => onPlayerAction("raise", currentBet || 10)}
                className="bg-green-600 hover:bg-green-700"
                disabled={playerChips < (currentBet * 2 || 20)}
              >
                {currentBet > 0 ? `Raise (${currentBet * 2})` : "Bet (10)"}
              </Button>
            </div>
          )}

          <div className="text-white mt-2">
            {isPlayerTurn
              ? "Your turn"
              : gameState?.gameStage !== "waiting"
              ? "Waiting for other players"
              : "Waiting for game to start"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokerTable;