import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../axiosConfig';
import { updateBalance } from '../../store/userSlice';
import rouletteWheel from '../../assets/Roulette.jpg'; // Placeholder for roulette wheel image
import { Wheel } from 'react-custom-roulette';

const RouletteGame = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, userInfo } = useSelector((state) => state.user);
    const [betAmount, setBetAmount] = useState(10);
    const [betType, setBetType] = useState(null);
    const [result, setResult] = useState(null);
    const [balance, setBalance] = useState(isLoggedIn ? userInfo.balance : 0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [winningNumber, setWinningNumber] = useState(0); // Track winning number for synchronization

    const generateRouletteData = () => {
        const numbers = Array.from({ length: 37 }, (_, i) => i);
        const colors = ['red', 'black'];

        return numbers.map((number) => {
            let backgroundColor, textColor = 'white';

            if (number === 0) {
                backgroundColor = 'green';
            } else {
                backgroundColor = colors[number % 2];
            }

            return {
                option: `${number}`,
                style: { backgroundColor, textColor }
            };
        });
    };

    const data = generateRouletteData();

    const betOptions = {
        colors: ['Red', 'Black'],
        numbers: Array.from({ length: 36 }, (_, i) => i + 1),
        ranges: ['1-18', '19-36']
    };

    const spinRoulette = async () => {
        if (balance < betAmount) {
            alert('Insufficient balance!');
            return;
        }

        if (!betType) {
            alert('Please place a bet before spinning!');
            return;
        }

        const winningNumber = Math.floor(Math.random() * 37); // 0-36
        setWinningNumber(winningNumber)
        setIsSpinning(true);
        setResult(null);
    };

    const handleStopSpinning = () => {
        // Simulate spinning the roulette wheel (random number between 0 and 36)
        const spin = (async () => {
            const winningColor = winningNumber === 0 ? 'Green' : winningNumber % 2 === 0 ? 'Red' : 'Black';
            // Check if the user won or lost based on their bet
            let won = false;
            let newBalance = balance - betAmount;
            if (betType === winningColor||
                (betType === '1-18' && winningNumber <= 18) ||
                (betType === '19-36' && winningNumber >= 19)) {
                won = true;
                newBalance = won ? balance + betAmount : balance - betAmount;
            }


            if(betType === winningNumber ){
                won = true;
                newBalance = won ? balance + 10*betAmount : balance - betAmount;
            }

            setBalance(newBalance);
            console.log(newBalance)
            setWinningNumber(winningNumber); // Set the winning number for synchronization

            // Update balance in the backend
            try {
                await api.put('/gameble/updateBalance', {
                    email: userInfo.email,
                    newBalance
                });
                dispatch(updateBalance(newBalance));
            } catch (error) {
                console.error('Error updating balance:', error);
                setBalance(balance);
            }

            // Display the result
            setResult({
                winningNumber,
                winningColor,
                message: won ? 'You Won!' : 'You Lost!'
            });
            setIsSpinning(false);
        }); // Simulate a delay for spinning the wheel
        spin()
    };

    return (
        <div className='flex justify-center items-center p-5' style={{ backgroundImage: `url(${rouletteWheel})` }}>
            <div className='flex flex-col md:flex-row justify-center items-center p-5 bg-gradient-to-r from-gray-800 to-gray-900 border border-emerald-600'>

                <Wheel
                    innerRadius={5}
                    mustStartSpinning={isSpinning}
                    prizeNumber={winningNumber} // Set prizeNumber to the winning number
                    data={data}
                    backgroundColors={['#3e3e3e', '#df3428']}
                    textColors={['#ffffff']}
                    onStopSpinning={handleStopSpinning} // Handle the stop event
                />
                <div className='text-white p-8 rounded-lg shadow-lg max-w-4xl w-full'>
                    <h2 className="text-7xl font-bold mb-4 text-center">Roulette Game</h2>

                    <div className="flex flex-col md:flex-row">
                        <div className="flex-1 flex flex-col justify-center items-center">
                            {result && (
                                <div className="text-center">
                                    <p className="text-4xl mb-4">Winning Number: {result.winningNumber}</p>
                                    <p className="text-4xl mb-4">Winning Color: {result.winningColor}</p>
                                    <p className="text-2xl font-bold">{result.message}</p>
                                </div>
                            )}

                            <button
                                onClick={spinRoulette}
                                disabled={isSpinning || balance === 0}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 disabled:opacity-50"
                            >
                                {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
                            </button>

                            <div className="m-5">
                                <p className="mb-2">Select Bet Amount:</p>
                                <div className="flex gap-4">
                                    {[10, 50, 100].map(amount => (
                                        <button
                                            key={amount}
                                            onClick={() => setBetAmount(amount)}
                                            className={`px-4 py-2 rounded ${betAmount === amount ? 'bg-blue-600' : 'bg-gray-950'}`}
                                        >
                                            ${amount}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center items-center ml-6">
                            <p className="mb-4">Balance: ${balance}</p>

                            <div className="mb-6">
                                <p className="mb-2">Bet on Color:</p>
                                <div className="flex gap-3">
                                    {betOptions.colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setBetType(color)}
                                            className={`px-4 py-2 rounded ${betType === color ? 'bg-green-600' : 'bg-gray-950'}`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="mb-2">Bet on Number:</p>
                                <div className="grid grid-cols-6 gap-2">
                                    {betOptions.numbers.map(number => (
                                        <button
                                            key={number}
                                            onClick={() => setBetType(number)}
                                            className={`px-4 py-2 rounded ${betType === number ? 'bg-green-600' : 'bg-gray-950'}`}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="mb-2">Bet on Range:</p>
                                <div className="flex gap-3">
                                    {betOptions.ranges.map(range => (
                                        <button
                                            key={range}
                                            onClick={() => setBetType(range)}
                                            className={`px-4 py-2 rounded ${betType === range ? 'bg-green-600' : 'bg-gray-950'}`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 text-xs text-gray-500">
                                <p>Gambling can be addictive. Play responsibly.</p>
                                <a href="www.com" className="text-blue-400 hover:underline">Need help?</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RouletteGame;
