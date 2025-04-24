
import './index.css'
import App from './App.jsx';
import Profile from './ui/components/UserProfile.jsx'
import ReactDOM from "react-dom/client";
import HistoryPage from './ui/components/HistoryPage.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Incomes from "./ui/components/BalanceIncomes.jsx";


export default function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Profile />}/>
        <Route path='/game' element={<App/>}/>
        <Route path='/history' element={<HistoryPage/>} />
        <Route path='/balance-income' element={< Incomes/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);