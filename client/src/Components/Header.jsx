import { useState } from "react";
import icon from "../assets/Title.png"
import HeaderItem from "./HeaderItem";

const Header = () => {
    const [currMenu, setCurrMenu] = useState("none");
    const [isSelected, setSelect] = useState(false);
    const items = ["Home", "Profile", "Games", "Promotions", "Support", "History"];
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
        <div className="flex items-center justify-center p-5 gap-5">
            <div className="flex items-center justify-center p-5 gap-5 cursor-pointer">
                <img src={icon} alt="" className="h-12" />
                <h1 className="text-blue-700 text-4xl font-bold">GameBle</h1>
            </div>
            <div className="flex items-center justify-center px-4 py-2 gap-5 bg-blue-900 rounded-lg">
                {items.map((item) => (
                    <HeaderItem key={item} item={item} currMenu={currMenu} handleClick={handleClick} />
                ))}
            </div>
        </div>
    )
}
export default Header;