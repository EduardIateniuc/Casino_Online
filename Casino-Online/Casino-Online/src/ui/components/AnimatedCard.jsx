import React from 'react';
import { motion } from 'framer-motion';

const animateCardDeal = (index, total) => ({
  initial: { scale: 0, x: -300, y: -200, rotation: -180 },
  animate: { scale: 1, x: 0, y: 0, rotation: 0 },
  transition: { 
    duration: 0.5,
    delay: index * 0.2,
    type: 'spring',
    stiffness: 100,
    damping: 10
  }
});

const getHiddenCardStyle = (index) => {
  const angle = index === 0 ? -10 : 10; // Перпендикулярное расположение двух карт
  return {
    transform: `rotate(${angle}deg)`,
  };
};

const AnimatedCard = ({ card, hidden, index, total, animate }) => {
  const isRed = card?.suit === '♥' || card?.suit === '♦';
  
  return (
    <motion.div
      {...(animate ? animateCardDeal(index, total) : {})}
      whileHover={{ y: -10, scale: 1.05 }}
      style={hidden ? getHiddenCardStyle(index) : {}}
      className={`
         rounded-lg
        relative overflow-hidden
        transform-gpu
        m-1 cursor-pointer
        ${hidden ? 'bg-gradient-to-br w-10 h-14 from-blue-800 to-blue-600' : 'w-16 h-22 bg-white'}
        shadow-[2px_2px_8px_rgba(0,0,0,0.3)]
      `}
    >
      {hidden ? (
        <div className="absolute inset-0">
          <div className="absolute inset-2 border-2 border-blue-400 rounded-lg opacity-30" />
          <div className="absolute inset-0 bg-pattern opacity-10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-lg bg-blue-500 opacity-20" />
          </div>
        </div>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-40" />
          <div className="absolute top-2 left-2 flex flex-col items-center">
            <span className={`text-lg font-bold ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
              {card.value}
            </span>
            <span className={`text-lg ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
              {card.suit}
            </span>
          </div>
          <div className="absolute bottom-2 right-2 flex flex-col items-center transform rotate-180">
            <span className={`text-lg font-bold ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
              {card.value}
            </span>
            <span className={`text-lg ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
              {card.suit}
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-4xl ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
              {card.suit}
            </div>
          </div>
          <div className="absolute top-1 right-1 w-3 h-3 border-t border-r border-gray-300 rounded-tr-lg opacity-50" />
          <div className="absolute bottom-1 left-1 w-3 h-3 border-b border-l border-gray-300 rounded-bl-lg opacity-50" />
        </>
      )}
      <div className="absolute inset-0 shadow-inner pointer-events-none" />
      <div className="absolute inset-0 border border-gray-200 rounded-lg" />
      <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-white via-transparent to-transparent opacity-20 transform rotate-12" />
    </motion.div>
  );
};

export default AnimatedCard;