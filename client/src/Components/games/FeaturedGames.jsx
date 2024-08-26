import React from 'react';
import coin from '../../assets/coin_flip.jpeg';
const FeaturedGames = () => {
    // This would typically come from an API or database
    const games = [
        { id: 1, name: "Fortune Flip", image: coin, category: "Double or Nothing" },
        { id: 2, name: "Blackjack Pro", image: "path/to/blackjack-image.jpg", category: "Table Games" },
        { id: 3, name: "Lucky Roulette", image: "path/to/roulette-image.jpg", category: "Table Games" },
        { id: 4, name: "Poker Night", image: "path/to/poker-image.jpg", category: "Poker" },
    ];

    return (
        <div className="bg-gray-900 px-8 pb-4">
            <div className="container mx-auto">
                <h2 className="text-3xl font-bold text-white mb-6">Featured Games</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {games.map((game) => (
                        <div key={game.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                            <img src={game.image} alt={game.name} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-white mb-2">{game.name}</h3>
                                <p className="text-gray-400">{game.category}</p>
                                <a href="/fortuneflip">
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