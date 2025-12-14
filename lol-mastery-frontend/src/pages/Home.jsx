import { useState, useEffect } from 'react';
import { summonerApi } from '../services/api';
import { fetchChampionData, getChampionName } from '../utils/championData';
import SummonerProfile from '../components/SummonerProfile';
import ChampionCard from '../components/ChampionCard';
import FilterBar from '../components/FilterBar';
import StatsCards from '../components/StatsCards';
import BackToTop from "../components/BackToTop.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import SkipToContent from "../components/SkipToContent.jsx";
import { REGIONS } from '../utils/constants.js';

function Home() {
    const [gameName, setGameName] = useState('');
    const [tagLine, setTagLine] = useState('');
    const [region, setRegion] = useState('NA1');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [summonerData, setSummonerData] = useState(null);
    const [championDataLoaded, setChampionDataLoaded] = useState(false);

    // Filtering & Sorting State
    const [sortBy, setSortBy] = useState('points-desc');
    const [filterLevel, setFilterLevel] = useState('all');
    const [showChestsOnly, setShowChestsOnly] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Load champion data on component mount
    useEffect(() => {
        const loadChampionData = async () => {
            try {
                await fetchChampionData();
                setChampionDataLoaded(true);
            } catch (error) {
                console.error('Failed to load champion data:', error);
                setChampionDataLoaded(true);
            }
        };

        loadChampionData();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSummonerData(null);

        try {
            const data = await summonerApi.searchSummoner(gameName, tagLine, region);
            setSummonerData(data);
        } catch (err) {
            let errorMessage = 'Failed to fetch summoner data. Please try again.';

            if (err.response?.status === 404) {
                errorMessage = `Summoner "${gameName}#${tagLine}" not found in ${region}. Please check the spelling and region.`;
            } else if (err.response?.status === 429) {
                errorMessage = 'Too many requests. Please wait a moment and try again.';
            } else if (err.response?.status === 401) {
                errorMessage = 'API authentication error. Please contact support.';
            } else if (!err.response) {
                errorMessage = 'Network error. Please check your internet connection.';
            }

            setError(errorMessage);
            console.error('Error fetching summoner:', err);
        } finally {
            setLoading(false);
        }
    };

    // Filter and Sort Champions
    const getFilteredAndSortedChampions = () => {
        if (!summonerData) return [];

        let champions = [...summonerData.championMasteries];

        // Apply search filter
        if (searchTerm) {
            champions = champions.filter((mastery) => {
                const name = getChampionName(mastery.championId).toLowerCase();
                return name.includes(searchTerm.toLowerCase());
            });
        }

        // Apply level filter
        if (filterLevel !== 'all') {
            champions = champions.filter(
                (mastery) => mastery.championLevel === parseInt(filterLevel)
            );
        }

        // Apply chest filter
        if (showChestsOnly) {
            champions = champions.filter((mastery) => mastery.isChestAvailable);
        }

        // Apply sorting
        champions.sort((a, b) => {
            switch (sortBy) {
                case 'points-desc':
                    return b.championPoints - a.championPoints;
                case 'points-asc':
                    return a.championPoints - b.championPoints;
                case 'level-desc':
                    return b.championLevel - a.championLevel;
                case 'level-asc':
                    return a.championLevel - b.championLevel;
                case 'name-asc':
                    return getChampionName(a.championId).localeCompare(
                        getChampionName(b.championId)
                    );
                case 'name-desc':
                    return getChampionName(b.championId).localeCompare(
                        getChampionName(a.championId)
                    );
                default:
                    return 0;
            }
        });

        return champions;
    };

    const filteredChampions = getFilteredAndSortedChampions();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
            <SkipToContent/>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                        LoL Mastery Dashboard
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">
                        Track your champion mastery progress and available chests
                    </p>
                </div>

                {/* Champion Data Loading */}
                {!championDataLoaded && (
                    <div className="bg-blue-500/20 border border-blue-500 text-blue-200 px-6 py-4 rounded-lg mb-8 animate-pulse">
                        ⏳ Loading champion data...
                    </div>
                )}

                {/* Search Form */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-2xl border border-gray-700">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm mb-2 text-gray-300">Game Name</label>
                            <input
                                type="text"
                                value={gameName}
                                onChange={(e) => setGameName(e.target.value)}
                                placeholder="Faker"
                                className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                required
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm mb-2 text-gray-300">Tag Line</label>
                            <input
                                type="text"
                                value={tagLine}
                                onChange={(e) => setTagLine(e.target.value)}
                                placeholder="KR1"
                                className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                required
                            />
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm mb-2 text-gray-300">Region</label>
                            <select
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            >
                                {REGIONS.map((r) => (
                                    <option key={r.value} value={r.value}>
                                        {r.label}
                                    </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={loading || !championDataLoaded}
                                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </span>
                                ) : (
                                    '🔍 Search'
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Error Message */}
                {error && <ErrorMessage message={error} onRetry={handleSearch} />}

                {/* Loading State */}
                {loading && <LoadingSpinner message="Fetching summoner data..." />}
                <main id="main-content">
                    {/* Summoner Data */}
                    {summonerData && (
                        <div className="animate-fadeIn">
                            <SummonerProfile summoner={summonerData} />

                            <StatsCards
                                summoner={summonerData}
                                filteredCount={filteredChampions.length}
                                totalCount={summonerData.championMasteries.length}
                            />

                            <FilterBar
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                filterLevel={filterLevel}
                                setFilterLevel={setFilterLevel}
                                showChestsOnly={showChestsOnly}
                                setShowChestsOnly={setShowChestsOnly}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                            />

                            {/* Champions Grid */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold">
                                        Champion Masteries
                                    </h2>
                                    <span className="text-gray-400 text-sm">
                                      {filteredChampions.length} champion{filteredChampions.length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                {filteredChampions.length === 0 ? (
                                    <div className="text-center py-20 text-gray-400">
                                        <div className="text-6xl mb-4">🔍</div>
                                        <p className="text-xl">No champions match your filters</p>
                                        <p className="text-sm mt-2">Try adjusting your search criteria</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                                        {filteredChampions.map((mastery) => (
                                            <ChampionCard
                                                key={mastery.championId}
                                                mastery={mastery}
                                                summonerInfo={{
                                                    gameName: summonerData.gameName,
                                                    tagLine: summonerData.tagLine,
                                                    region: summonerData.region
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
            <BackToTop/>
        </div>
    );
}

export default Home;