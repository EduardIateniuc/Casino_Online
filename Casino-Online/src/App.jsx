import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import Footer from './ui/footerRouter';
import { Volume2, VolumeX, ChevronDown, History, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GameSettings from './ui/components/GameSettings';
import './index.css';

const SUITS = ['♠', '♣', '♥', '♦'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const CARD_VALUES = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
  '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

const PokerGame = () => {
  // All state declarations grouped together
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [botHands, setBotHands] = useState([]); // Added missing state
  const [communityCards, setCommunityCards] = useState([]);
  const [pot, setPot] = useState(0);
  const [playerChips, setPlayerChips] = useState(1000);
  const [computerChips, setComputerChips] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [gameStage, setGameStage] = useState('preFlop');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameHistory, setGameHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [dealAnimation, setDealAnimation] = useState(false);
  const [numBots, setNumBots] = useState(1);
  const [initialBet, setInitialBet] = useState(10);
  const [showSettings, setShowSettings] = useState(true);


  localStorage.setItem("balance", playerChips);

  // Helper functions
  const shuffleDeck = useCallback(() => {
    const newDeck = [];
    SUITS.forEach(suit => {
      VALUES.forEach(value => {
        newDeck.push({ suit, value });
      });
    });

    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }

    return newDeck;
  }, []);

  const dealCards = useCallback(() => {
    const newDeck = shuffleDeck();
    const playerHand = [newDeck.pop(), newDeck.pop()];
    const newBotHands = Array.from({ length: numBots }, () => [newDeck.pop(), newDeck.pop()]);

    setDeck(newDeck);
    setPlayerHand(playerHand);
    setBotHands(newBotHands);
    setCommunityCards([]);
    setPot(0);
    setCurrentBet(initialBet);
    setGameStage('preFlop');
  }, [numBots, initialBet, shuffleDeck]);

  const startGame = useCallback((numBots, initialBet) => {
    setNumBots(numBots);
    setInitialBet(initialBet);
    setShowSettings(false);
  }, []);

  const EmptyCardSlot = () => (
    <div className="w-16 h-24 rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center m-1">
      <div className="text-gray-400 text-lg">?</div>
    </div>
  );

  const AnimatedCard = ({ card, hidden, index, total, animate }) => {
    const cardColor = ['♥', '♦'].includes(card.suit) ? 'text-red-500' : 'text-black';
    
    return (
      <motion.div
        initial={animate ? { scale: 0 } : false}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className={`w-16 h-24 bg-white rounded-lg border border-gray-300 flex items-center justify-center m-1 ${cardColor}`}
      >
        {hidden ? '?' : `${card.value}${card.suit}`}
      </motion.div>
    );
  };

  const evaluateHand = useCallback((cards) => {
    const allCards = [...cards];
    const values = allCards.map(card => CARD_VALUES[card.value]);
    const suits = allCards.map(card => card.suit);

    const isFlush = suits.every(suit => suit === suits[0]);
    const sortedValues = [...new Set(values)].sort((a, b) => a - b);
    const isStrait = sortedValues.length >= 5 && 
      sortedValues[sortedValues.length - 1] - sortedValues[0] === sortedValues.length - 1;

    const valueCounts = values.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

    const pairs = Object.values(valueCounts).filter(count => count === 2).length;
    const threes = Object.values(valueCounts).filter(count => count === 3).length;
    const fours = Object.values(valueCounts).filter(count => count === 4).length;

    if (isFlush && isStrait) return { rank: 9, name: 'Стрит-флеш' };
    if (fours > 0) return { rank: 8, name: 'Каре' };
    if (threes > 0 && pairs > 0) return { rank: 7, name: 'Фулл-хаус' };
    if (isFlush) return { rank: 6, name: 'Флеш' };
    if (isStrait) return { rank: 5, name: 'Стрит' };
    if (threes > 0) return { rank: 4, name: 'Тройка' };
    if (pairs === 2) return { rank: 3, name: 'Две пары' };
    if (pairs === 1) return { rank: 2, name: 'Пара' };
    return { rank: 1, name: 'Старшая карта' };
  }, []);

  // Game logic functions
  const playSound = useCallback((soundType) => {
    if (!isSoundEnabled) return;
    
    const sounds = {
      deal: new Audio('/sounds/card-deal.mp3'),
      win: new Audio('/sounds/win.mp3'),
      bet: new Audio('/sounds/chip-bet.mp3'),
      fold: new Audio('/sounds/fold.mp3')
    };

    if (sounds[soundType]) {
      sounds[soundType].play().catch(e => console.log('Sound play error:', e));
    }
  }, [isSoundEnabled]);

  const determineWinner = useCallback(() => {
    const playerHandStrength = evaluateHand([...playerHand, ...communityCards]);
    const computerHandStrength = botHands.map(hand => evaluateHand([...hand, ...communityCards]));

    let winner, winningHand;
    if (playerHandStrength.rank > Math.max(...computerHandStrength.map(h => h.rank))) {
      winner = 'Игрок';
      winningHand = playerHandStrength.name;
      setPlayerChips(prev => prev + pot);
    } else {
      winner = 'Компьютер';
      winningHand = computerHandStrength[0].name;
      setComputerChips(prev => prev + pot);
    }

    playSound('win');
    setGameHistory(prev => [{
      winner,
      pot,
      winningHand,
      date: new Date().toLocaleString()
    }, ...prev]);
    
    setTimeout(dealCards, 2000);
  }, [playerHand, botHands, communityCards, pot, dealCards, evaluateHand, playSound]);

  const progressGame = useCallback(() => {
    switch (gameStage) {
      case 'preFlop':
        setDealAnimation(true);
        const flop = [deck.pop(), deck.pop(), deck.pop()];
        setCommunityCards(flop);
        setGameStage('flop');
        setTimeout(() => setDealAnimation(false), 500);
        break;
      case 'flop':
        setDealAnimation(true);
        setCommunityCards(prev => [...prev, deck.pop()]);
        setGameStage('turn');
        setTimeout(() => setDealAnimation(false), 500);
        break;
      case 'turn':
        setDealAnimation(true);
        setCommunityCards(prev => [...prev, deck.pop()]);
        setGameStage('river');
        setTimeout(() => setDealAnimation(false), 500);
        break;
      case 'river':
        setGameStage('showdown');
        determineWinner();
        break;
    }
  }, [gameStage, deck, determineWinner]);

  const computerAI = useCallback(() => {
    if (!isPlayerTurn) {
      const handStrength = evaluateHand([...botHands[0], ...communityCards]);
      setTimeout(() => {
        if (handStrength.rank >= 4) {
          playerAction('raise', false);
        } else if (handStrength.rank >= 2) {
          playerAction('call', false);
        } else {
          playerAction(Math.random() > 0.7 ? 'fold' : 'call', false);
        }
      }, Math.random() * 1000 + 500);
    }
  }, [isPlayerTurn, botHands, communityCards, evaluateHand]);

  const playerAction = useCallback((action, isPlayer = true) => {
    playSound('bet');
    
    switch (action) {
      case 'call':
        if (isPlayer) {
          setPlayerChips(prev => prev - currentBet);
        } else {
          setComputerChips(prev => prev - currentBet);
        }
        setPot(prev => prev + currentBet);
        break;
      case 'raise':
        const raiseAmount = currentBet * 2;
        if (isPlayer) {
          setPlayerChips(prev => prev - raiseAmount);
        } else {
          setComputerChips(prev => prev - raiseAmount);
        }
        setPot(prev => prev + raiseAmount);
        setCurrentBet(raiseAmount);
        break;
      case 'fold':
        playSound('fold');
        if (isPlayer) {
          setComputerChips(prev => prev + pot);
        } else {
          setPlayerChips(prev => prev + pot);
        }
        dealCards();
        return;
    }
    
    setIsPlayerTurn(!isPlayer);
    if (!isPlayer) {
      progressGame();
    }
  }, [currentBet, pot, dealCards, progressGame, playSound]);

  // Effects
  useEffect(() => {
    if (!showSettings) {
      dealCards();
    }
  }, [showSettings, dealCards]);

  useEffect(() => {
    if (!isPlayerTurn) {
      computerAI();
    }
  }, [isPlayerTurn, computerAI]);

  if (showSettings) {
    return <GameSettings onStartGame={startGame} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Верхняя панель */}
        <div className="flex justify-between mb-4 rounded-full px-6 py-2 bg-black bg-opacity-75 text-white">
          <div className="w-2/5 rounded-full flex items-center gap-2">
            Balance: {playerChips}
          </div>
          <Button 
            onClick={() => playerAction('call')}
            className="bg-green-600 hover:bg-green-700 rounded-full"
          >
            <Plus className='w-7 h-7'/>
          </Button>
        </div>
        {/* Компьютер */}
        <div className="flex justify-around mb-8">
          {botHands.map((hand, index) => (
            <Card key={index} className="p-4 bg-opacity-90 bg-white shadow-lg">
              <CardContent>
                <div className="text-center mb-2 text-gray-800">Бот {index + 1}</div>
                <div className="flex justify-center">
                  {hand.map((card, cardIndex) => (
                    <AnimatedCard
                      key={cardIndex}
                      card={card}
                      hidden={gameStage !== 'showdown'}
                      index={cardIndex}
                      total={hand.length}
                      animate={false}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
  
        {/* Общие карты */}
        <div className="relative flex justify-center items-center w-full h-48 rounded-lg shadow-lg mb-8">
            <AnimatePresence>
              {communityCards.map((card, index) => (
                <AnimatedCard
                  key={index}
                  card={card}
                  index={index}
                  total={communityCards.length}
                  animate={true} // Анимация включена для общих карт
                  className="relative justify-center items-center z-10"
                />
              ))}
              {communityCards.length < 5 && Array.from({ length: 5 - communityCards.length }).map((_, i) => (
                <EmptyCardSlot key={`empty-${i}`} />
              ))}
            </AnimatePresence>
          </div>
  
        {/* Игрок */}
        <div className="flex justify-center">
  <Card className="p-4 bg-opacity-90 bg-white shadow-lg">
    <CardContent>
      <div className="text-center mb-2 text-gray-800">Вы: {playerChips} фишек</div>
      <div className="flex justify-center mb-4">
        <AnimatePresence>
          {playerHand.map((card, index) => (
            <AnimatedCard
              key={index}
              card={card}
              index={index}
              total={playerHand.length}
              animate={false} // Анимация отключена для карт игрока
            />
          ))}
          {playerHand.length < 2 && Array.from({ length: 2 - playerHand.length }).map((_, i) => (
            <EmptyCardSlot key={`empty-${i}`} />
          ))}
        </AnimatePresence>
      </div>
      {isPlayerTurn && (
        <div className="flex justify-center gap-2">
          <Button 
            onClick={() => playerAction('fold')}
            className="bg-red-500 hover:bg-red-600 shadow-md"
          >
            Сбросить
          </Button>
          <Button 
            onClick={() => playerAction('call')}
            className="bg-blue-500 hover:bg-blue-600 shadow-md"
            disabled={playerChips < currentBet}
          >
            Колл ({currentBet})
          </Button>
          <Button 
            onClick={() => playerAction('raise')}
            className="bg-green-500 hover:bg-green-600 shadow-md"
            disabled={playerChips < currentBet * 2}
          >
            Рейз ({currentBet * 2})
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
</div>
        {/* Индикатор текущей комбинации */}
        {playerHand.length > 0 && (
          <div className="mt-4 text-center">
            <Alert className="bg-white bg-opacity-90 shadow-lg">
              <AlertDescription className="text-white">
                Ваша комбинация: {evaluateHand([...playerHand, ...communityCards]).name}
              </AlertDescription>
            </Alert>
          </div>
        )}
  
        {/* Модальные окна */}
        {showHistory && <GameHistory />}
        {isMultiplayer && <MultiplayerRoom />}
      </div>

      <Footer/>
    </div>
    
  );
};

export default PokerGame;





  
  