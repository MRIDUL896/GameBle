import FeaturedGames from "../Components/games/FeaturedGames";
import RpGateway from "../Components/paymentGateway/RpGateway";

const Home = () => {
    return(
        <div className="">
           { <FeaturedGames/>}
           {<RpGateway amount={100}/>}
        </div>
    )
}

export default Home;