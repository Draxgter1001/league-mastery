import { useState } from 'react';

function Home(){
    const [gameName, setGameName] = useState('');
    const [tagLine, setTagLine] = useState('');
    const [region, setRegion] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for: ', {gameName, tagLine, region });
    };

    return(
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="max-w-md w-full p-8">
                <h1 className="text-4xl font-bold mb-8 text-center">
                    LoL Mastery Dashboard
                </h1>

                <form onSubmit={handleSearch} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-2">Game Name</label>
                        <input
                            type="text"
                            value={gameName}
                            onChange={(e) => setGameName(e.target.value)}
                            placeholder="Faker"
                            className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required/>
                    </div>
                    <div>
                        <label className="block text-sm mb-2">Tag Line</label>
                        <input
                            type="text"
                            value={tagLine}
                            onChange={(e) => setTagLine(e.target.value)}
                            placeholder="KR1"
                            className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required/>
                    </div>
                    <div>
                        <label className="block text-sm mb-2">Region</label>
                        <select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="NA1">North America</option>
                            <option value="EUW1">Europe West</option>
                            <option value="EUN1">Europe Nordic & East</option>
                            <option value="KR">Korea</option>
                            <option value="BR1">Brazil</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-semibold transition">
                        Search Summoner
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Home;