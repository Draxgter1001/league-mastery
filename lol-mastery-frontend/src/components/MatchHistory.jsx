import { useState, useEffect } from 'react';
import { summonerApi } from '../services/api';
import MatchCard from './MatchCard';
import LoadingSpinner from './LoadingSpinner';

function MatchHistory({ gameName, tagLine, championId, region }) {
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await summonerApi.getChampionMatches(
                    gameName,
                    tagLine,
                    championId,
                    region,
                    20 // Fetch last 10 matches
                );
                setMatchData(data);
            } catch (err) {
                console.error('Error fetching match history:', err);
                setError('Failed to load match history');
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [gameName, tagLine, championId, region]);

    if (loading) {
        return (
            <div className="py-8">
                <LoadingSpinner message="Loading match history..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-center">
                <p className="text-red-400 text-sm">{error}</p>
            </div>
        );
    }

    if (!matchData || matchData.recentMatches.length === 0) {
        return (
            <div className="bg-gray-700/50 rounded-lg p-6 text-center">
                <div className="text-4xl mb-2">🎮</div>
                <p className="text-gray-400 text-sm">No recent matches found with this champion</p>
            </div>
        );
    }

    const { recentMatches, overallStats } = matchData;

    return (
        <div className="space-y-4 animate-fadeIn">
            {/* Overall Stats Summary */}
            {overallStats.totalGames > 0 && (
                <div className="bg-gray-700/50 rounded-lg p-4 grid grid-cols-4 gap-2 border border-gray-600">
                    <div className="text-center">
                        <div className="text-xs text-gray-400 mb-1">Games</div>
                        <div className="text-lg font-bold text-white">{overallStats.totalGames}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-gray-400 mb-1">Win Rate</div>
                        <div className={`text-lg font-bold ${
                            overallStats.winRate >= 60 ? 'text-green-400' :
                                overallStats.winRate >= 50 ? 'text-blue-400' :
                                    'text-red-400'
                        }`}>
                            {overallStats.winRate.toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">
                            {overallStats.wins}W {overallStats.losses}L
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-gray-400 mb-1">Avg KDA</div>
                        <div className={`text-lg font-bold ${
                            overallStats.averageKDA >= 4 ? 'text-yellow-400' :
                                overallStats.averageKDA >= 3 ? 'text-green-400' :
                                    overallStats.averageKDA >= 2 ? 'text-blue-400' :
                                        'text-gray-400'
                        }`}>
                            {overallStats.averageKDA.toFixed(2)}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs text-gray-400 mb-1">K/D/A</div>
                        <div className="text-sm font-semibold text-gray-300">
                            {overallStats.averageKills.toFixed(1)}/
                            {overallStats.averageDeaths.toFixed(1)}/
                            {overallStats.averageAssists.toFixed(1)}
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Matches Title */}
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-300">
                    Recent Matches ({recentMatches.length})
                </h4>
            </div>

            {/* Match Cards */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {recentMatches.map((match, index) => (
                    <MatchCard key={match.matchId || index} match={match} />
                ))}
            </div>
        </div>
    );
}

export default MatchHistory;