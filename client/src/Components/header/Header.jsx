import icon from "../../assets/Title.png";
import HeaderItem from "./HeaderItem";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { logout, updatePage } from "../../store/userSlice";
import { FaBitcoinSign } from "react-icons/fa6";

const Header = () => {
    const items = ["Home", "Profile", "Games", "Promotions", "Support", "History"];
    const { isLoggedIn, userInfo, page } = useSelector((state) => state.user);
    console.log('Redux state:', { isLoggedIn, userInfo, page });
    const email = userInfo ? userInfo.email : "";
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:8000/gameble/logout', {
                email,
            });
            dispatch(logout(response.data.user));
        } catch (err) {
            console.log(err);
        }
    };

    const handleClick = (menu) => {
        if (menu !== page) {
            dispatch(updatePage(menu));
        } else {
            dispatch(updatePage("none"));
        }
        window.location.href = "/";
    };

    return (
        <div className="flex flex-col items-center justify-center p-5 gap-5">
            <div className="flex flex-col md:flex-row items-center justify-center gap-5">
                <a href="/">
                    <div className="flex items-center justify-center p-5 gap-5 cursor-pointer">
                        <img src={icon} alt="" className="h-12" />
                        <h1 className="text-blue-700 text-4xl font-bold">GameBle</h1>
                    </div>
                </a>
                <div className="flex flex-col md:flex-row items-center justify-center px-4 py-2 gap-5 bg-blue-900 rounded-lg">
                    {items.map((item) => (
                        <HeaderItem key={item} item={item} currMenu={page} handleClick={handleClick} />
                    ))}
                </div>
                {isLoggedIn && (
                    <div className="flex items-center gap-4 ">
                        <div className="flex items-center bg-black text-white p-3 gap-4 rounded-lg">
                            <div className="bg-yellow-600 rounded-full p-2">
                                <FaBitcoinSign />
                            </div>
                            <span>{userInfo.balance || '0'}</span>
                        </div>
                        <div className="bg-red-700 rounded-xl p-3 hover:bg-red-500">
                            <button onClick={() => handleLogout()}>Logout</button>
                        </div>
                    </div>
                )}
            </div>
            {isLoggedIn && (
                <span className="text-white font-bold p-3 rounded-lg text-4xl">
                    Welcome {userInfo.name || ''}
                </span>
            )}
        </div>
    );
};

export default Header;
