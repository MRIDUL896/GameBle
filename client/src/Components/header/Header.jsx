import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { logout, updatePage } from "../../store/userSlice";
import { FaBitcoin, FaBars, FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import api from '../axiosConfig';
import icon from "../../assets/MainIcon.png";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [headerVisible, setHeaderVisible] = useState(true);
    const location = useLocation();

    const items = ["Home", "Chats", "Profile", "Games", "Promotions", "Support", "History"];
    const { isLoggedIn, userInfo, page } = useSelector((state) => state.user);
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
        if(location.pathname !== "/"){
            window.location.href = "/";
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScroll > lastScrollTop) {
                // Scrolling down
                setHeaderVisible(false);
            } else {
                // Scrolling up
                setHeaderVisible(true);
            }
            setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll); // For Mobile or negative scrolling
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollTop]);

    return (
        <div
            className={`fixed top-0 left-6 p-3 rounded-lg z-10 m-1 w-[95%] bg-gray-950 text-white shadow-md transition-transform duration-300 ${
                headerVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
            <div className="container mx-auto">
                <div className="flex items-center justify-between gap-1">
                    <a href="/" className="flex items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105" onClick={() => dispatch(updatePage("Home"))}>
                        <img src={icon} alt="Main Icon" className="h-13" />
                    </a>

                    <div className="hidden md:flex">
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
                            <div className="mt-4 mx-2 space-y-2">
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
        </div>
    );
};

export default Header;
