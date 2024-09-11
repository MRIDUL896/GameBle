import icon from "../../assets/Title.png";
import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { logout, updatePage } from "../../store/userSlice";
import { FaBitcoin, FaBars, FaTimes } from "react-icons/fa";
import api from '../axiosConfig';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const items = ["Home", "Chats", "Profile", "Games", "Promotions", "Support", "History"];
    const { isLoggedIn, userInfo, page } = useSelector((state) => state.user);
    console.log(userInfo)
    const email = userInfo ? userInfo.email : "";
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            const response = await api.post('/gameble/logout', { email });
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
        setIsMenuOpen(false);
        window.location.href = "/";
    };

    return (
        <div className="bg-gray-950 p-4 ">
            <div className="container mx-auto">
                <div className="flex items-center justify-evenly">
                    <a href="/" className="flex items-center justify-center p-5 gap-5 cursor-pointer transition-transform duration-300 hover:scale-105">
                        <img src={icon} alt="" className="h-12" />
                        <span className="text-4xl font-bold text-blue-400">GameBle</span>
                    </a>
                    
                    <div className="hidden md:flex md:items-center md:justify-center md:gap-2">
                        <nav className="flex items-center gap-2">
                            {items.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => handleClick(item)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition-transform duration-300 hover:scale-105
                                    ${page === item
                                        ? 'bg-indigo-700 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </nav>
                        
                        {isLoggedIn && (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-3 py-1 rounded-md shadow-lg">
                                    <FaBitcoin className="mr-1" />
                                    <span>{(Math.floor(userInfo.balance * 100) / 100).toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors duration-300"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-gray-300 hover:text-white focus:outline-none"
                    >
                        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>
                
                {isMenuOpen && (
                    <div className="md:hidden mt-4">
                        <nav className="flex flex-col space-y-2">
                            {items.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => handleClick(item)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300
                                    ${page === item
                                        ? 'bg-indigo-700 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </nav>
                        
                        {isLoggedIn && (
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center bg-gradient-to-r from-yellow-600 to-yellow-700 text-white px-3 py-2 rounded-md shadow-lg">
                                    <FaBitcoin className="mr-2" />
                                    <span>{(Math.floor(userInfo.balance * 100) / 100).toFixed(2)}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md transition-colors duration-300"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            {isLoggedIn && (
                <div className="text-center py-4">
                    <span className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text">
                        Welcome, {userInfo.name || ''}
                    </span>
                </div>
            )}
        </div>
    );
};

export default Header;