import FeaturedGames from "../Components/games/FeaturedGames";
import Shop from "../paymentGateway/Shop";
import Support from "../Components/Support"
import { useSelector } from "react-redux";
import ProfileCard from "../Components/ProfileCard";
import ChatsPage from "../Components/chats/ChatsPage";
import RouletteGame from "../Components/games/RouletteGame";

const Home = () => {
    const { page } = useSelector((state) => state.user);
    return(
        <div className="bg-gray-950 flex flex-col justify-center items-center">
           {(page==="Games" || page==="Home" || page==="none") && <FeaturedGames/>}
           {(page==="Promotions" || page==="Home" || page==="none") && <Shop/>}
           {(page==="Support" || page==="Home" || page==="none") && <Support/>}
           { (page==="Profile" ) && <ProfileCard/>}
           { (page==="Chats") && <ChatsPage/> }
           { (page === "roulettegame" && <RouletteGame/>)}
        </div>
    )
}

export default Home;