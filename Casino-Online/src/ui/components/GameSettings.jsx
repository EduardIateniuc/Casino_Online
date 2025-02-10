import React, { useState } from 'react';
import { Card, CardContent } from '../card';
import { Button } from '../button';

const GameSettings = ({ onStartGame }) => {
  const [localNumBots, setLocalNumBots] = useState(1);
  const [localInitialBet, setLocalInitialBet] = useState(10);

  const handleNumBotsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 4) {
      setLocalNumBots(value);
    }
  };

  const handleInitialBetChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setLocalInitialBet(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <Card className="p-6 bg-white">
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Настройки игры</h2>
          <div className="mb-4">
            <label className="block mb-2">Количество ботов (1-4):</label>
            <input
              type="number"
              min="1"
              max="4"
              value={localNumBots}
              onChange={handleNumBotsChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Начальная ставка:</label>
            <input
              type="number"
              min="1"
              value={localInitialBet}
              onChange={handleInitialBetChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <Button
            onClick={() => onStartGame(localNumBots, localInitialBet)}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Начать игру
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameSettings;