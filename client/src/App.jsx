import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Header from "./Components/header/Header";
import LoginModal from "./Components/LoginModal";
import { useSelector } from "react-redux";
import Footer from "./Components/Footer";
import FortuneFlip from "./Components/games/FortuneFlip";

function App() {
  const { isLoggedIn } = useSelector((state) => state.user);
  return (
    <div className="bg-slate-900">
      <Header/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/fortuneflip" element={<FortuneFlip/>}/>
        </Routes>
        {!isLoggedIn && <LoginModal onClose={() => {}} />}
      </BrowserRouter>
      <Footer/>
    </div>
  );
}

export default App;