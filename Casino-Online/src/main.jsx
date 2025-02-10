
import './index.css'
import App from './App.jsx';
import Profile from './ui/components/UserProfile.jsx'
import ReactDOM from "react-dom/client";
import HistoryPage from './ui/components/HistoryPage.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";


export default function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/history' element={<HistoryPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);