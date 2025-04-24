
import './index.css'
import App from './App.jsx';
import Profile from './ui/components/Profile.jsx'
import ReactDOM from "react-dom/client";
import HistoryPage from './ui/components/HistoryPage.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Incomes from "./ui/components/BalanceIncomes.jsx";
import Rating from './ui/components/Rating.jsx';
import MainPage from './ui/components/MainPage.jsx';
import PokerWebSocket from './ui/components/PokerWebSocket.jsx';
import PokerGame from './ui/components/test/PokerGame.jsx';

export default function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={< MainPage/>}/>
        <Route path='/test' element={ <PokerGame/>}/>
        <Route path='/game' element={<App/>}/>
        <Route path='/history' element={<HistoryPage/>} />
        <Route path='/balance-income' element={< Incomes/>}/>
        <Route path='/rating' element={< Rating/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);