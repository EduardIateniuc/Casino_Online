import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();
      setUser(tg.initDataUnsafe?.user);
    }
  }, []);

  return (
    <div className="p-4 text-center">
      <h1 className="text-xl font-bold">Telegram Web App</h1>
      {user ? (
        <p>Привет, {user.first_name}!</p>
      ) : (
        <p>Не удалось получить данные пользователя</p>
      )}
    </div>
  );
}

export default App;