import React, { useState } from 'react';
import { Card, CardContent } from '../card';
import { Button } from '../button';
import footer from '../footerRouter';

const GameSettings = ({ onStartGame }) => {
  const [localNumBots, setLocalNumBots] = useState("");
  const [localInitialBet, setLocalInitialBet] = useState("");

  const handleNumBotsChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && Number(value) >= 1 && Number(value) <= 4)) {
      setLocalNumBots(value);
    }
  };

  const handleInitialBetChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && Number(value) >= 1)) {
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
              type="text"
              value={localNumBots}
              onChange={handleNumBotsChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Начальная ставка:</label>
            <input
              type="text"
              value={localInitialBet}
              onChange={handleInitialBetChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <Button
            onClick={() => onStartGame(Number(localNumBots) || 1, Number(localInitialBet) || 1)}
            className="w-full bg-green-500 hover:bg-green-600"
            disabled={localNumBots === "" || localInitialBet === ""}
          >
            Начать игру
          </Button>
        </CardContent>
      </Card>
      <Footer/>
    </div>
  );
};

export default GameSettings;
