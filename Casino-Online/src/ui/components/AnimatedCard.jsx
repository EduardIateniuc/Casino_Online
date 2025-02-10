// Компонент карты с анимацией
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

const animateCardDeal = (index, total, target) => {
  return {
    initial: { scale: 0, x: -300, y: -200, rotation: -180 },
    animate: { scale: 1, x: 0, y: 0, rotation: 0 },
    transition: { 
      duration: 0.5,
      delay: index * 0.2,
      type: 'spring',
      stiffness: 100,
      damping: 10
    }
  };
};

const AnimatedCard = ({ card, hidden, index, total, animate }) => {
    const isRed = card.suit === '♥' || card.suit === '♦';
    return (
      <motion.div
        {...(animate ? animateCardDeal(index, total) : {})} // Анимация только если animate=true
        className={`
          w-16 h-24 rounded-lg border-2 border-gray-200 
          flex items-center justify-center 
          ${hidden ? 'bg-gradient-to-br from-blue-600 to-blue-800' : 'bg-white'}
          shadow-lg hover:shadow-xl transition-shadow duration-200
          relative overflow-hidden
          m-1
        `}
      >
        {/* Внутренняя тень для эффекта глубины */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-10"></div>
  
        {/* Угловые элементы карты */}
        {!hidden && (
          <>
            <div className="absolute top-1 left-1 text-sm font-bold">
              <div className={`${isRed ? 'text-red-500' : 'text-black'}`}>
                {card.value}
              </div>
              <div className={`${isRed ? 'text-red-500' : 'text-black'}`}>
                {card.suit}
              </div>
            </div>
            <div className="absolute bottom-1 right-1 text-sm font-bold transform rotate-180">
              <div className={`${isRed ? 'text-red-500' : 'text-black'}`}>
                {card.value}
              </div>
              <div className={`${isRed ? 'text-red-500' : 'text-black'}`}>
                {card.suit}
              </div>
            </div>
          </>
        )}
  
        {/* Центральный элемент карты */}
        {!hidden && (
          <div className={`text-3xl font-bold ${isRed ? 'text-red-500' : 'text-black'}`}>
            {card.suit}
          </div>
        )}
      </motion.div>
    );
  };
  export default AnimatedCard;