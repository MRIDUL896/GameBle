import { useState } from "react";
import icon from "../../assets/Title.png"
import HeaderItem from "./HeaderItem";
import { useSelector } from "react-redux";

const Header = () => {
    const [currMenu, setCurrMenu] = useState("none");
    const [isSelected, setSelect] = useState(false);
    const items = ["Home", "Profile", "Games", "Promotions", "Support", "History"];
    const {isLoggedIn , userInfo} = useSelector((state) => state.user);
    const handleClick = (menu) => {
        if(menu !== currMenu){
            setCurrMenu(menu);
        }
        else if (!isSelected) {
            setCurrMenu(menu);
            setSelect(true);
        } else {
            setCurrMenu("none");
            setSelect(false);
        }
    }
    return (
        <div className="flex flex-col items-center justify-center p-5 gap-5">
        <div className="flex items-center justify-center gap-5">
            <div className="flex items-center justify-center p-5 gap-5 cursor-pointer">
                <img src={icon} alt="" className="h-12" />
                <h1 className="text-blue-700 text-4xl font-bold">GameBle</h1>
            </div>
            <div className="flex items-center justify-center px-4 py-2 gap-5 bg-blue-900 rounded-lg">
                {items.map((item) => (
                    <HeaderItem key={item} item={item} currMenu={currMenu} handleClick={handleClick} />
                ))}
            </div>
            {isLoggedIn && (
                <div className="flex items-center gap-4 ">
                    <div className="flex items-center bg-black text-white p-3 rounded-lg">
                        <img src="" alt="" />
                        <span>1000</span>
                    </div>
                </div>
            )}
        </div>
        {
            isLoggedIn && (
                <span className="text-white font-bold p-3 rounded-lg text-4xl">Welcome, {userInfo.username}</span>
            )
        }
        </div>
        
    )
}
export default Header;