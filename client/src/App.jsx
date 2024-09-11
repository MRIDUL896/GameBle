import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Header from "./Components/header/Header";
import LoginModal from "./Components/LoginModal";
import { useSelector } from "react-redux";
import Footer from "./Components/Footer";
import FortuneFlip from "./Components/games/FortuneFlip";
import Mines from "./Components/games/Mines";

function App() {
  const { isLoggedIn } = useSelector((state) => state.user);
  return (
    <div className="bg-gray-950">
      <Header/>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/fortuneflip" element={<FortuneFlip/>}/>
          <Route path="/mines" element={<Mines/>}/>
        </Routes>
        {!isLoggedIn && <LoginModal onClose={() => {}} />}
      </BrowserRouter>
      <Footer/>
    </div>
  );
}

export default App;