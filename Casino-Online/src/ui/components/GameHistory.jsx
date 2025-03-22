
import React from 'react';
import { Card, CardContent } from '../card.jsx';
import { Button } from '../button';

const fetchGames = () => {

  
  try{

  }catch {
    
  }
}

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

  export default GameHistory;