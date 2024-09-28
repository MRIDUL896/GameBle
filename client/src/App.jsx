import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Header from "./Components/header/Header";
import LoginModal from "./Components/LoginModal";
import { useSelector } from "react-redux";
import Footer from "./Components/Footer";
import React from "react";
import "./index.css";
import FortuneFlip from "./Components/games/FortuneFlip";
import Mines from "./Components/games/Mines";
import Profile from "./Components/Profile";
import DiceGame from "./Components/games/DiceGame";
import RouletteGame from "./Components/games/RouletteGame";

function App() {
  const { isLoggedIn } = useSelector((state) => state.user);

  return (
    <BrowserRouter> {/* Moved BrowserRouter to wrap everything */}
      <div className="bg-gray-950">
        <Header />
        <div className="p-20 bg-gray-950"> {/* Adjusted padding */}</div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fortuneflip" element={<FortuneFlip />} />
          <Route path="/mines" element={<Mines />} />
          <Route path="/dice" element={<DiceGame />} />
          <Route path={`/u/:userInfoId`} element={<Profile />} />
          <Route path="/roulettegame" element={<RouletteGame />} />
        </Routes>
        {!isLoggedIn && <LoginModal onClose={() => {}} />}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
