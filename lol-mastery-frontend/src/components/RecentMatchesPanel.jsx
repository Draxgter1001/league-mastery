import { useState, useEffect } from 'react';
import { summonerApi } from '../services/api';
import CompactMatchCard from './CompactMatchCard';
import LoadingSpinner from './LoadingSpinner';

const RecentMatchesPanel = ({ summonerInfo }) => {
    const [matches, setMatches] = useState([]);
    const [filteredMatches, setFilteredMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('All');

    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            setError(null);

            try {
                const { gameName, tagLine, region } = summonerInfo;
                const data = await summonerApi.getRecentMatches(
                    gameName,
                    tagLine,
                    region.toLowerCase(),
                    20
                );
                setMatches(data);
                setFilteredMatches(data);
            } catch (err) {
                console.error('Error fetching recent matches:', err);
                setError('Failed to load recent matches');
            } finally {
                setLoading(false);
            }
        };

        if (summonerInfo) {
            fetchMatches();
        }
    }, [summonerInfo]);

    // Filter matches when filter changes
    useEffect(() => {
        if (selectedFilter === 'All') {
            setFilteredMatches(matches);
        } else {
            const filtered = matches.filter(match =>
                match.gameMode.toLowerCase().includes(selectedFilter.toLowerCase())
            );
            setFilteredMatches(filtered);
        }
    }, [selectedFilter, matches]);

    // Get unique game modes for filter
    const getGameModes = () => {
        const modes = new Set(matches.map(m => m.gameMode));
        return ['All', ...Array.from(modes)];
    };

    const displayedMatches = expanded ? filteredMatches : filteredMatches.slice(0, 4);

    if (loading) {
        return (
            <div className="mb-8 p-6 bg-slate-800/50 rounded-xl">
                <LoadingSpinner message="Loading recent matches..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="mb-8 p-6 bg-slate-800/50 rounded-xl">
                <p className="text-red-400 text-center">{error}</p>
            </div>
        );
    }

    if (matches.length === 0) {
        return (
            <div className="mb-8 p-6 bg-slate-800/50 rounded-xl">
                <p className="text-slate-400 text-center">No recent matches found</p>
            </div>
        );
    }

    return (
        <div className="mb-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-slate-700/50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Recent Matches
                    <span className="text-sm text-slate-400 font-normal">
            ({filteredMatches.length} {selectedFilter !== 'All' ? `${selectedFilter} ` : ''}matches)
          </span>
                </h2>

                {/* Filter Dropdown */}
                <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {getGameModes().map(mode => (
                        <option key={mode} value={mode}>{mode}</option>
                    ))}
                </select>
            </div>

            {/* Matches List */}
            <div className="p-4 space-y-2">
                {displayedMatches.map((match) => (
                    <CompactMatchCard key={match.matchId} match={match} />
                ))}
            </div>

            {/* Expand/Collapse Button */}
            {filteredMatches.length > 4 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full py-3 bg-slate-700/50 hover:bg-slate-700 text-white font-medium transition-colors flex items-center justify-center gap-2"
                >
                    {expanded ? (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Show Less
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Show All {filteredMatches.length} Matches
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

export default RecentMatchesPanel;