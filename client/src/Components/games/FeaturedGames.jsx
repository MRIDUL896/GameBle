import React from 'react';
import coin from '../../assets/coin_flip.jpeg';
import mines from '../../assets/mines.webp';
import dice from '../../assets/Dice.jpg'
import roulette from '../../assets/Roulette.jpg'

const FeaturedGames = () => {
    // This would typically come from an API or database
    const games = [
        { id: 1, name: "Fortune Flip", image: coin, category: "Double or Nothing",link : "/fortuneflip" },
        { id: 2, name: "Mines", image: mines, category: "Grid Games" , link : "/mines"},
        { id: 3, name: "Dice", image: dice, category: "Dice Games" , link : "/dice" },
        { id: 4, name: "Roulette Game", image: roulette, category: "Roulette", link : "/roulettegame" },
    ];

    return (
        <div className="bg-gray-800 p-8 w-[95%] rounded-xl">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-blue-400 text-center mb-6">Featured Games</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-blue-200">
                    {games.map((game) => (
                        <div key={game.id} className="bg-gray-950 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105
                        hover:border-2 hover:border-purple-900">
                            <img src={game.image} alt={game.name} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold  mb-2">{game.name}</h3>
                                <p className="text-gray-400">{game.category}</p>
                                <a href={game.link}>
                                    <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition-colors duration-300">
                                        Play Now
                                    </button>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default FeaturedGames;