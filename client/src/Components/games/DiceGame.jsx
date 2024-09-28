import React, { useState } from 'react';
import diceImage from '../../assets/Dice.jpg'; // Replace with any image if needed
import { useSelector, useDispatch } from 'react-redux';
import api from '../axiosConfig';
import { updateBalance } from '../../store/userSlice';
import { Dice1Icon, Dice2Icon, Dice3Icon, Dice4Icon, Dice5Icon, Dice6Icon } from "lucide-react";

const DiceGame = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, userInfo } = useSelector((state) => state.user);
    const [betAmount, setBetAmount] = useState(10);
    const [guessSum, setGuessSum] = useState(null);
    const [diceValues, setDiceValues] = useState([]);
    const [gameResult, setGameResult] = useState(null);
    const [balance, setBalance] = useState(isLoggedIn ? userInfo.balance : 0);
    const [isRolling, setIsRolling] = useState(false);

    const getDiceIcon = (value) => {
        switch (value) {
            case 1:
                return <Dice1Icon className="w-16 h-16" />; // Adjusted icon size
            case 2:
                return <Dice2Icon className="w-16 h-16" />;
            case 3:
                return <Dice3Icon className="w-16 h-16" />;
            case 4:
                return <Dice4Icon className="w-16 h-16" />;
            case 5:
                return <Dice5Icon className="w-16 h-16" />;
            case 6:
                return <Dice6Icon className="w-16 h-16" />;
            default:
                return null;
        }
    };

    const handleBet = (amount) => {
        setBetAmount(amount);
    };

    const rollDice = async () => {
        if (balance < betAmount) {
            alert("Insufficient balance!");
            return;
        }

        if (guessSum === null) {
            alert("Please make a guess before rolling!");
            return;
        }

        setIsRolling(true);
        setGameResult(null);

        // Simulate dice roll
        setTimeout(async () => {
            const dice1 = Math.floor(Math.random() * 6) + 1;
            const dice2 = Math.floor(Math.random() * 6) + 1;
            const sum = dice1 + dice2;
            setDiceValues([dice1, dice2]);

            const newBalance = sum === guessSum ? balance + betAmount : balance - betAmount;
            setBalance(newBalance);

            try {
                await api.put('/gameble/updateBalance', {
                    email: userInfo.email,
                    newBalance
                }).then(() => {
                    dispatch(updateBalance(newBalance)); // Update Redux state
                }).catch(error => {
                    console.error("Error updating balance:", error);
                    setBalance(balance);
                }).finally(() => {
                    setGameResult(sum === guessSum ? 'You Won!' : 'You Lost!');
                    setIsRolling(false);
                })
            } catch (error) {
                console.error("Error updating balance:", error);
                setBalance(balance);
            }
        }, 1000);
    };

    return (
        <div className='flex justify-center items-center p-5' style={{ backgroundImage: `url(${diceImage})` }}>

            <div className='bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 rounded-lg shadow-lg max-w-4xl w-full border border-emerald-600'>
                <h2 className="text-7xl font-bold mb-4 text-center">Dice Roll Game</h2>
                <div className="flex flex-col md:flex-row">
                    {/* Left Section: Dice Roll */}
                    <div className="flex-1 flex flex-col justify-center items-center">
                        <div className="flex justify-center items-center mb-4 gap-4">
                            {diceValues.length > 0 && diceValues.map((value, index) => (
                                <div key={index} className='flex justify-center items-center bg-black text-yellow-400 rounded-lg'>
                                    {getDiceIcon(value)}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={rollDice}
                            disabled={isRolling || balance === 0}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 disabled:opacity-50"
                        >
                            {isRolling ? 'Rolling...' : 'Roll Dice'}
                        </button>
                        {/* Bet Amount Selection */}
                        <div className="m-5">
                            <p className="mb-2">Select Bet Amount:</p>
                            <div className="flex gap-4">
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
                        {gameResult && (
                            <div className="">
                                <p className="text-2xl font-bold">{gameResult}</p>
                                <p>{gameResult === 'You Won!' ? `You won $${betAmount}` : `You lost $${betAmount}`}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Section: Game Controls */}
                    <div className="flex-1 flex flex-col justify-center items-center ml-6">
                        <p className="mb-4">Balance: ${balance}</p>

                        {/* Guess Sum of Dice */}
                        <div className="mb-6">
                            <p className="mb-2">Guess the Sum of Two Dice:</p>
                            <div className="flex flex-wrap gap-3 justify-center">
                                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(sum => (
                                    <button
                                        key={sum}
                                        onClick={() => setGuessSum(sum)}
                                        className={`px-4 py-2 rounded ${guessSum === sum ? 'bg-green-600' : 'bg-gray-950'}`}
                                    >
                                        {sum}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Game Rules */}
                        <div className="text-sm text-gray-400 mb-4">
                            <p className="mb-2">Game Rules:</p>
                            <ul className="list-disc list-inside">
                                <li>Guess the sum of two dice</li>
                                <li>Correct guess doubles your bet</li>
                                <li>Wrong guess loses your bet</li>
                            </ul>
                        </div>

                        {/* Responsible Gaming Notice */}
                        <div className="mt-4 text-xs text-gray-500">
                            <p>Gambling can be addictive. Play responsibly.</p>
                            <a href="www.com" className="text-blue-400 hover:underline">Need help?</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiceGame;
