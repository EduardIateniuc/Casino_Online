import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '../card';
import { Button } from '../button';


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


  export default MultiplayerRoom;