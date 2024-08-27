import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { updateBalance } from '../../store/userSlice';
import mines from '../../assets/mines.webp';

const Mines = () => {
    const dispatch = useDispatch();
    const { isLoggedIn, userInfo } = useSelector((state) => state.user);
    const [grid, setGrid] = useState(Array(16).fill(null));
    const [minePositions, setMinePositions] = useState([]);
    const [difficulty, setDifficulty] = useState('easy');
    const [betAmount, setBetAmount] = useState(10);
    const [gameOver, setGameOver] = useState(false);
    const [reward, setReward] = useState(0);
    const [balance, setBalance] = useState(isLoggedIn ? userInfo.balance : 0);

    const difficultySettings = {
        easy: { mines: 5, multiplier: 10 },
        medium: { mines: 7, multiplier: 20 },
        hard: { mines: 9, multiplier: 30 }
    };

    const initializeGame = () => {
        if (balance < betAmount) {
            alert("Insufficient balance!");
            return;
        }

        const newGrid = Array(16).fill(null);
        const mines = [];
        while (mines.length < difficultySettings[difficulty].mines) {
            const position = Math.floor(Math.random() * 16);
            if (!mines.includes(position)) {
                mines.push(position);
            }
        }
        setMinePositions(mines);
        setGrid(newGrid);
        setGameOver(false);
        setReward(0);
    };

    const handleCellClick = (index) => {
        if (gameOver || grid[index] !== null) return;

        const newGrid = [...grid];
        if (minePositions.includes(index)) {
            newGrid[index] = 'X';
            setGrid(newGrid);
            endGame(false);
        } else {
            newGrid[index] = 'O';
            setGrid(newGrid);
            const newReward = reward + (0.1 * betAmount);
            setReward(newReward);

            if (newGrid.filter(cell => cell === 'O').length === 16 - difficultySettings[difficulty].mines) {
                endGame(true);
            }
        }
    };

    const endGame = async (won) => {
        setGameOver(true);
        let finalReward = won ? reward * difficultySettings[difficulty].multiplier : reward;
        const newBalance = balance + finalReward - betAmount;

        try {
            await axios.put('http://localhost:8000/gameble/updateBalance', {
                email: userInfo.email,
                newBalance
            });
            dispatch(updateBalance(newBalance));
            setBalance(newBalance);
        } catch (error) {
            console.error("Error updating balance:", error);
        }
    };

    return (
        <div className='w-full p-3' style={{ backgroundImage: `url(${mines})` }}>
            <div className="flex flex-col items-center bg-gradient-to-r from-cyan-900 to-purple-900 text-white mb-5 p-12 rounded-lg shadow-lg max-w-md mx-auto border border-emerald-600">
                <h2 className="text-3xl font-bold mb-4">Mines</h2>
                <p className="mb-4">Balance: ${balance}</p>

                <div className="mb-4">
                    <label className="mr-2">Difficulty:</label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="bg-purple-700 p-2 rounded"
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="mr-2">Bet Amount:</label>
                    <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Number(e.target.value))}
                        className="bg-purple-700 p-2 rounded w-20"
                    />
                </div>

                <button
                    onClick={initializeGame}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
                >
                    Start Game
                </button>

                <div className="grid grid-cols-4 gap-2 mb-4">
                    {grid.map((cell, index) => (
                        <button
                            key={index}
                            onClick={() => handleCellClick(index)}
                            className={`w-16 h-16 hover:bg-purple-400 ${cell === null ? 'bg-purple-700' :
                                    cell === 'X' ? 'bg-red-700' : 'bg-green-700'
                                } rounded-lg font-bold text-2xl`}
                            disabled={gameOver || cell !== null}
                        >
                            {cell}
                        </button>
                    ))}
                </div>

                <p className="text-xl font-bold mb-2">Current Reward: ${reward.toFixed(2)}</p>

                {gameOver && (
                    <p className="text-2xl font-bold mt-4">
                        {reward > 0 ? `You won $${reward.toFixed(2)}!` : 'Game Over!'}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Mines;