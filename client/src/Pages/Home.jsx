import FeaturedGames from "../Components/games/FeaturedGames";
import Shop from "../paymentGateway/Shop";
import Support from "../Components/Support"
import { useSelector } from "react-redux";
import ProfileCard from "../Components/ProfileCard";
import ChatsPage from "../Components/chats/ChatsPage";

const Home = () => {
    const { page } = useSelector((state) => state.user);
    return(
        <div className="">
           {(page==="Games" || page==="Home") && <FeaturedGames/>}
           {(page==="Promotions" || page==="Home") && <Shop/>}
           {(page==="Support" || page==="Home") && <Support/>}
           { (page==="Profile" ) && <ProfileCard/>}
           { (page==="Chats") && <ChatsPage/> }
        </div>
    )
}

export default Home;