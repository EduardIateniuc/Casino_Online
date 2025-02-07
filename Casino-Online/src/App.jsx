import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Volume2, VolumeX, ChevronDown, History, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Table from './assets/table3.png';
import './index.css';

// Колода карт и константы
const SUITS = ['♠', '♣', '♥', '♦'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const CARD_VALUES = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
  '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

// Главный компонент игры
const PokerGame = () => {
  // Состояния игры
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [computerHand, setComputerHand] = useState([]);
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
  const [players, setPlayers] = useState([]);
  const [dealAnimation, setDealAnimation] = useState(false);

  // Звуковые эффекты
  const playSound = (soundType) => {
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
  };

  // Функция определения комбинации
  const evaluateHand = (cards) => {
    const allCards = [...cards];
    const values = allCards.map(card => CARD_VALUES[card.value]);
    const suits = allCards.map(card => card.suit);

    // Проверка на флеш
    const isFlush = suits.every(suit => suit === suits[0]);

    // Проверка на стрит
    const sortedValues = [...new Set(values)].sort((a, b) => a - b);
    const isStrait = sortedValues.length >= 5 && 
      sortedValues[sortedValues.length - 1] - sortedValues[0] === sortedValues.length - 1;

    // Подсчет пар, троек и каре
    const valueCounts = values.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});

    const pairs = Object.values(valueCounts).filter(count => count === 2).length;
    const threes = Object.values(valueCounts).filter(count => count === 3).length;
    const fours = Object.values(valueCounts).filter(count => count === 4).length;

    // Определение комбинации
    if (isFlush && isStrait) return { rank: 9, name: 'Стрит-флеш' };
    if (fours > 0) return { rank: 8, name: 'Каре' };
    if (threes > 0 && pairs > 0) return { rank: 7, name: 'Фулл-хаус' };
    if (isFlush) return { rank: 6, name: 'Флеш' };
    if (isStrait) return { rank: 5, name: 'Стрит' };
    if (threes > 0) return { rank: 4, name: 'Тройка' };
    if (pairs === 2) return { rank: 3, name: 'Две пары' };
    if (pairs === 1) return { rank: 2, name: 'Пара' };
    return { rank: 1, name: 'Старшая карта' };
  };

  // ИИ компьютера
  const computerAI = useCallback(() => {
    if (!isPlayerTurn) {
      const hand = [...computerHand, ...communityCards];
      const handStrength = evaluateHand(hand);
      const randomDelay = Math.floor(Math.random() * 1000) + 500;

      setTimeout(() => {
        // Логика принятия решений на основе силы руки
        if (handStrength.rank >= 4) {
          // С сильной рукой повышаем ставку
          playerAction('raise', false);
        } else if (handStrength.rank >= 2) {
          // Со средней рукой обычно уравниваем
          playerAction('call', false);
        } else {
          // Со слабой рукой иногда сбрасываем
          const shouldFold = Math.random() > 0.7;
          playerAction(shouldFold ? 'fold' : 'call', false);
        }
      }, randomDelay);
    }
  }, [isPlayerTurn, computerHand, communityCards]);

  // Анимация раздачи карт
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

  // Компонент карты с анимацией
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
  
  // Пустая ячейка для карты
  const EmptyCardSlot = () => (
    <div className="w-16 h-24 rounded-lg border-2 border-dashed border-gray-400 flex items-center justify-center m-1">
      <div className="text-gray-400 text-lg">?</div>
    </div>
  );

  const shuffleDeck = () => {
    const newDeck = [];
    SUITS.forEach(suit => {
      VALUES.forEach(value => {
        newDeck.push({ suit, value });
      });
    });
  
    // Перемешивание массива
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
  
    return newDeck;
  };
  
  const dealCards = () => {
    const newDeck = shuffleDeck();
    const playerHand = [newDeck.pop(), newDeck.pop()];
    const computerHand = [newDeck.pop(), newDeck.pop()];
  
    setDeck(newDeck);
    setPlayerHand(playerHand);
    setComputerHand(computerHand);
    setCommunityCards([]);
    setPot(0);
    setCurrentBet(10); // Начальная ставка
    setGameStage('preFlop');
  };
  

  // История игр
  const GameHistory = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Card className="w-96 p-4 max-h-[80vh] overflow-auto">
        <CardContent>
          <h3 className="text-lg font-bold mb-4">История игр</h3>
          {gameHistory.map((game, index) => (
            <div key={index} className="mb-4 p-2 border rounded">
              <div>Победитель: {game.winner}</div>
              <div>Банк: {game.pot}</div>
              <div>Комбинация: {game.winningHand}</div>
            </div>
          ))}
          <Button onClick={() => setShowHistory(false)}>Закрыть</Button>
        </CardContent>
      </Card>
    </div>
  );

  // Мультиплеер (упрощенная версия)
  const MultiplayerRoom = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Card className="w-96 p-4">
        <CardContent>
          <h3 className="text-lg font-bold mb-4">Комната игроков</h3>
          <div className="mb-4">
            {players.map((player, index) => (
              <div key={index} className="p-2 border rounded mb-2">
                {player.name} - {player.chips} фишек
              </div>
            ))}
          </div>
          <Button onClick={() => setIsMultiplayer(false)}>
            Вернуться к игре
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Действия игрока
  const playerAction = (action, isPlayer = true) => {
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
          addToHistory('Компьютер', pot, 'Fold');
        } else {
          setPlayerChips(prev => prev + pot);
          addToHistory('Игрок', pot, 'Fold');
        }
        dealCards();
        return;
    }
    
    setIsPlayerTurn(!isPlayer);
    if (!isPlayer) {
      progressGame();
    }
  };

  // Добавление записи в историю
  const addToHistory = (winner, finalPot, winningHand) => {
    setGameHistory(prev => [{
      winner,
      pot: finalPot,
      winningHand,
      date: new Date().toLocaleString()
    }, ...prev]);
  };

  // Определение победителя
  const determineWinner = () => {
    const playerHandStrength = evaluateHand([...playerHand, ...communityCards]);
    const computerHandStrength = evaluateHand([...computerHand, ...communityCards]);

    let winner, winningHand;
    if (playerHandStrength.rank > computerHandStrength.rank) {
      winner = 'Игрок';
      winningHand = playerHandStrength.name;
      setPlayerChips(prev => prev + pot);
    } else if (computerHandStrength.rank > playerHandStrength.rank) {
      winner = 'Компьютер';
      winningHand = computerHandStrength.name;
      setComputerChips(prev => prev + pot);
    } else {
      // В случае равных комбинаций, сравниваем старшие карты
      winner = Math.random() > 0.5 ? 'Игрок' : 'Компьютер';
      winningHand = playerHandStrength.name;
      if (winner === 'Игрок') {
        setPlayerChips(prev => prev + pot);
      } else {
        setComputerChips(prev => prev + pot);
      }
    }

    playSound('win');
    addToHistory(winner, pot, winningHand);
    
    setTimeout(dealCards, 2000);
  };

  // Прогресс игры
  const progressGame = () => {
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
  };

  // Эффекты
  useEffect(() => {
    dealCards();
  }, []);

  useEffect(() => {
    if (!isPlayerTurn) {
      computerAI();
    }
  }, [isPlayerTurn, computerAI]);

  const calculateHandTotal = (hand) => {
    return hand.reduce((total, card) => {
      if (card.value === 'A') {
        return total + 11; // Пример для карты "A" (туз)
      } else if (['K', 'Q', 'J'].includes(card.value)) {
        return total + 10; // Пример для карт король, дама, валет
      } else {
        return total + parseInt(card.value, 10); // Для числовых карт
      }
    }, 0);
  };
  
  const computerHandTotal = calculateHandTotal(computerHand);
  
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
        <div className="flex justify-center mb-8">
          <Card className="p-4 bg-opacity-90 bg-white shadow-lg">
            <CardContent>
              <div className="text-center mb-2 text-gray-800">Компьютер: {computerChips} фишек</div>
              <div className="flex justify-center">
                <AnimatePresence>
                  {computerHand.map((card, index) => (
                    <AnimatedCard
                      key={index}
                      card={card}
                      hidden={gameStage !== 'showdown'}
                      index={index}
                      total={computerHand.length}
                      animate={false} // Анимация отключена для карт компьютера
                    />
                  ))}
                  {computerHand.length < 2 && Array.from({ length: 2 - computerHand.length }).map((_, i) => (
                    <EmptyCardSlot key={`empty-${i}`} />
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
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
    </div>
  );
};
  
export default PokerGame;