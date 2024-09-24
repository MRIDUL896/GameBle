import React, { useState } from 'react';
import coinFlip from '../../assets/coin_flip.jpeg';
import { useSelector, useDispatch } from 'react-redux';
import api from '../axiosConfig'
import { updateBalance } from '../../store/userSlice'; 

const FortuneFlip = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, userInfo } = useSelector((state) => state.user);
    const [choice, setChoice] = useState("");
    const [betAmount, setBetAmount] = useState(10);
    const [cresult, setCresult] = useState(null);
    const [balance, setBalance] = useState(isLoggedIn ? userInfo.balance : 0);
    const [isFlipping, setIsFlipping] = useState(false);

    const handleBet = (amount) => {
        setBetAmount(amount);
    };

    const flipCoin = async (playerChoice) => {
        if (balance < betAmount) {
            alert("Insufficient balance!");
            return;
        }

        setIsFlipping(true);
        setCresult(null);

        // Simulate coin flip
        setTimeout(async () => {
            const re = Math.random() < 0.5 ? "heads" : "tails";
            setCresult(re);

            const newBalance = re === playerChoice
                ? balance + betAmount
                : balance - betAmount;

            setBalance(newBalance);

            try {
                await api.put('/gameble/updateBalance', {
                    email: userInfo.email,
                    newBalance
                });
                dispatch(updateBalance(newBalance)); // Update Redux state
            } catch (error) {
                console.error("Error updating balance:", error);
                setBalance(balance);
            }

            setIsFlipping(false);
        }, 1000);
    };


    return (
        <div className='w-full p-3' style={{ backgroundImage: `url(${coinFlip})` }}>
            <div className="flex flex-col items-center bg-gradient-to-r from-gray-800 to-gray-900
 text-white mb-5 p-12 rounded-lg shadow-lg max-w-md mx-auto border border-emerald-600">
                <h2 className="text-3xl font-bold mb-4 text-center">Fortune Flip</h2>
                <p className="mb-4 text-center">Balance: ${balance}</p>
                <div className='flex justify-center items-center bg-yellow-400 h-20 w-20 rounded-full border-8 border-yellow-600'>
                    {cresult && (
                        <div className='font-bold text-3xl'> {cresult === "heads" ? "H" : "T"} </div>
                    )}
                </div>
                <div className="flex flex-col items-center m-4">
                    <p className="mb-2">Select Bet Amount:</p>
                    <div className="flex justify-between gap-10">
                        {[10, 50, 100].map(amount => (
                            <button
                                key={amount}
                                onClick={() => handleBet(amount)}
                                className={`px-4 py-2 rounded ${betAmount === amount ? 'bg-blue-600' : 'bg-gray-950'}`}
                            >
                                ${amount}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='flex gap-5'>
                    <button
                        onClick={() => {
                            setChoice("heads");
                            flipCoin("heads");
                        }}
                        disabled={isFlipping || balance===0}
                        className="w-[50%] bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 disabled:opacity-50"
                    >
                        {isFlipping ? 'Flipping...' : 'Heads'}
                    </button>

                    <button
                        onClick={() => {
                            setChoice("tails");
                            flipCoin("tails");
                        }}
                        disabled={isFlipping || balance === 0}
                        className="w-[50%] bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 disabled:opacity-50"
                    >
                        {isFlipping ? 'Flipping...' : 'Tails'}
                    </button>
                </div>

                {cresult !== null && (
                    <div className="text-center mb-4">
                        <p className="text-2xl font-bold mb-2">
                            {choice === cresult ? 'You Won!' : 'You Lost!'}
                        </p>
                        <p>{choice === cresult ? `You won $${betAmount}` : `You lost $${betAmount}`}</p>
                    </div>
                )}

                <div className="text-sm text-gray-400">
                    <p className="mb-2">Game Rules:</p>
                    <ul className="list-disc list-inside">
                        <li>50% chance to double your bet</li>
                        <li>50% chance to lose your bet</li>
                    </ul>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                    <p>Gambling can be addictive. Play responsibly.</p>
                    <a href="www.com" className="text-blue-400 hover:underline">Need help?</a>
                </div>
            </div>
        </div>
    );
};

export default FortuneFlip;