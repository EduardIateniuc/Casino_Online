import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../card.jsx';
import AnimatedCard from './AnimatedCard';

const PokerTable = ({ 
  numBots, 
  botHands, 
  gameStage, 
  communityCards, 
  playerHand, 
  pot,
  isPlayerTurn,
  onPlayerAction,
  currentBet,
  playerChips 
}) => {
  return (
    <div className="relative w-full min-h-[calc(100vh-120px)] flex flex-col items-center justify-between p-4">
      {/* Main Table */}
      <div className="relative w-full max-w-4xl aspect-[16/9] md:aspect-[2/1] mx-auto">
        {/* Felt Table */}
        <div className="absolute inset-0 rounded-[40%] bg-green-800 border-8 border-brown-900 shadow-2xl overflow-hidden">
          {/* Table Patterns */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,rgba(0,0,0,.3)_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,.1)_45%,rgba(255,255,255,.1)_55%,transparent_60%)]" />
          
          {/* Table Logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-black bg-opacity-20 flex items-center justify-center">
            <span className="text-white text-opacity-30 text-xl font-bold">POKER</span>
          </div>

          {/* Pot Display */}
          
        </div>

        {/* Bot Players */}
        <div className="absolute inset-0">
          {botHands.map((hand, index) => {
            const angle = (180 / (numBots + 1)) * (index + 1);
            const radius = 48;
            const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
            const y = 20 + radius * Math.sin((angle * Math.PI) / 180);

            return (
              <div
                key={index}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div className="relative">
                  {/* Avatar */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white border-4 border-blue-500 overflow-hidden shadow-lg">
                    <img
                      src={`https://w7.pngwing.com/pngs/129/292/png-transparent-female-avatar-girl-face-woman-user-flat-classy-users-icon.png`}
                      alt={`Bot ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Cards */}
                  <div className="flex gap-1 scale-75 md:scale-100">
                    {hand.map((card, cardIndex) => (
                      <AnimatedCard
                        key={cardIndex}
                        card={card}
                        hidden={gameStage !== 'showdown'}
                        index={cardIndex}
                        total={hand.length}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Community Cards */}
        <div className="absolute mt-48 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center gap-1 scale-75 md:scale-100">
          {communityCards.map((card, index) => (
            <AnimatedCard
              key={index}
              card={card}
              index={index}
              total={communityCards.length}
              animate={true}
            />
          ))}
        </div>
        

        {/* Player Area */}
        <div className="absolute  bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">

          <Card className="bg-opacity-90 mt-96 shadow-xl">
            <CardContent className="p-2">
              <div className="flex flex-col items-center">
                <div className="flex gap-1 scale-75 md:scale-100">
                  {playerHand.map((card, index) => (
                    <AnimatedCard
                      key={index}
                      card={card}
                      index={index}
                      total={playerHand.length}
                    />
                  ))}
                </div>
                {isPlayerTurn && (
                  <div className="flex gap-2 mt-4 scale-90 md:scale-100">
                    <button 
                      onClick={() => onPlayerAction('fold')}
                      className="px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600"
                    >
                      Fold
                    </button>
                    <button 
                      onClick={() => onPlayerAction('call')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600"
                      disabled={playerChips < currentBet}
                    >
                      Call ${currentBet}
                    </button>
                    <button 
                      onClick={() => onPlayerAction('raise')}
                      className="px-4 py-2 bg-green-500 text-white rounded-full text-sm hover:bg-green-600"
                      disabled={playerChips < currentBet * 2}
                    >
                      Raise ${currentBet * 2}
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PokerTable;