import { useState, useEffect } from 'react';
import { summonerApi } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import MatchCard from './MatchCard';

const MatchHistory = ({ championId, summonerInfo, championName }) => {
    const [matchData, setMatchData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            setError(null);

            try {
                const { gameName, tagLine, region } = summonerInfo;
                const data = await summonerApi.getChampionMatches(
                    gameName,
                    tagLine,
                    championId,
                    region.toLowerCase(),
                    10
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
    }, [championId, summonerInfo]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner message="Loading match history..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    if (!matchData || matchData.recentMatches.length === 0) {
        return (
            <div className="p-6 text-center">
                <p className="text-slate-400">No recent matches found for {championName}</p>
            </div>
        );
    }

    const { overallStats, recentMatches, championName: backendChampionName } = matchData;

    return (
        <div className="p-6">
            {/* Overall Stats Section */}
            <div className="mb-6 p-6 bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl border border-blue-500/30">
                <h3 className="text-lg font-semibold text-white mb-4">Overall Performance</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white">{overallStats.totalGames}</div>
                        <div className="text-sm text-slate-400">Games</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-400">{overallStats.winRate.toFixed(0)}%</div>
                        <div className="text-sm text-slate-400">Win Rate</div>
                        <div className="text-xs text-slate-500 mt-1">
                            {overallStats.wins}W / {overallStats.losses}L
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-400">{overallStats.averageKDA.toFixed(2)}</div>
                        <div className="text-sm text-slate-400">Avg KDA</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-slate-300">
                            {overallStats.averageKills.toFixed(1)} / {overallStats.averageDeaths.toFixed(1)} / {overallStats.averageAssists.toFixed(1)}
                        </div>
                        <div className="text-sm text-slate-400">K / D / A</div>
                    </div>
                </div>
            </div>

            {/* Recent Matches */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                    Recent Matches ({recentMatches.length})
                </h3>
                <div className="space-y-3">
                    {recentMatches.map((match) => (
                        <MatchCard key={match.matchId} match={match} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MatchHistory;