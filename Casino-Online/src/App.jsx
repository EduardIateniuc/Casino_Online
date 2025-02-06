import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState("");
  const [randomNumber, setRandomNumber] = useState(null);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();
      setUser(tg.initDataUnsafe?.user);
    }
  }, []);

  const startGame = () => {
    setRandomNumber(Math.floor(Math.random() * 100) + 1);
    setGameStarted(true);
    setResult("");
  };

  const handleGuess = () => {
    if (parseInt(guess) === randomNumber) {
      setResult("Поздравляем, вы угадали число!");
    } else {
      setResult("Попробуйте снова!");
    }
  };

  return (
    <div className="p-4 text-center">
      <h1 className="text-xl font-bold">Телеграм Веб-Игра</h1>
      {user ? (
        <p>Привет, {user.first_name}!</p>
      ) : (
        <p>Не удалось получить данные пользователя</p>
      )}
      
      {!gameStarted ? (
        <button onClick={startGame} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Начать игру
        </button>
      ) : (
        <div className="mt-4">
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="px-4 py-2 border rounded"
            placeholder="Введите ваше число"
          />
          <button
            onClick={handleGuess}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
          >
            Проверить
          </button>
          {result && <p className="mt-4 text-lg font-semibold">{result}</p>}
        </div>
      )}
    </div>
  );
}

export default App;
