import { useState } from 'react';
import { getChampionImageUrl } from '../utils/championData';
import Modal from './Modal';
import MatchHistory from './MatchHistory';

const ChampionCard = ({ mastery, championName, summonerInfo }) => {
    const [showMatchModal, setShowMatchModal] = useState(false);

    const getMasteryColor = (level) => {
        const colors = {
            7: 'from-yellow-600 to-orange-600',
            6: 'from-purple-600 to-pink-600',
            5: 'from-blue-600 to-cyan-600',
            4: 'from-green-600 to-emerald-600',
            3: 'from-slate-600 to-slate-700',
            2: 'from-slate-700 to-slate-800',
            1: 'from-slate-800 to-slate-900',
        };
        return colors[level] || colors[1];
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(0) + 'K';
        }
        return num.toString();
    };

    const getMasteryBadge = (level) => {
        if (level >= 5) {
            return (
                <div className="absolute top-2 right-2 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg z-10">
                    {level}
                </div>
            );
        }
        return (
            <div className="absolute top-2 right-2 bg-slate-800/90 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg z-10">
                {level}
            </div>
        );
    };

    const getProgressPercentage = () => {
        if (mastery.championLevel === 7) return 100;
        const total = mastery.championPointsSinceLastLevel + mastery.championPointsUntilNextLevel;
        return (mastery.championPointsSinceLastLevel / total) * 100;
    };

    const renderLevelUpIndicator = () => {
        if (mastery.championLevel === 7) {
            return (
                <div className="mt-2 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold rounded-full text-center">
                    ⭐ Max Level
                </div>
            );
        }

        if (mastery.championPointsUntilNextLevel === 0) {
            return (
                <div className="mt-2 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-full text-center animate-pulse">
                    ⭐ Ready to level up!
                    {mastery.tokensEarned > 0 && (
                        <span className="ml-1">({mastery.tokensEarned}/{mastery.championLevel >= 6 ? 3 : 2} tokens)</span>
                    )}
                </div>
            );
        }

        if (mastery.tokensEarned > 0) {
            return (
                <div className="mt-2 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold rounded-full text-center">
                    🎖️ {mastery.tokensEarned} token{mastery.tokensEarned > 1 ? 's' : ''}
                </div>
            );
        }

        return null;
    };

    return (
        <>
            <article
                className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${getMasteryColor(mastery.championLevel)} 
          shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group`}
                role="article"
                aria-label={`${championName} mastery card, level ${mastery.championLevel}, ${formatNumber(mastery.championPoints)} points`}
                tabIndex={0}
            >
                {/* Champion Image */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={getChampionImageUrl(mastery.championId)}
                        alt={championName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    {getMasteryBadge(mastery.championLevel)}

                    {/* Chest Indicator */}
                    {mastery.chestGranted && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-lg">
                            📦 Chest Earned
                        </div>
                    )}
                </div>

                {/* Champion Name */}
                <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-1 truncate">{championName}</h3>
                    <p className="text-sm text-slate-200 font-semibold">
                        {formatNumber(mastery.championPoints)} pts
                    </p>

                    {/* Level Up Indicator */}
                    {renderLevelUpIndicator()}

                    {/* Progress Bar */}
                    {mastery.championLevel < 7 && (
                        <div className="mt-3">
                            <div className="flex justify-between text-xs text-slate-300 mb-1">
                                <span>Progress to Level {mastery.championLevel + 1}</span>
                                <span>
                  {formatNumber(mastery.championPointsSinceLastLevel)} / {formatNumber(mastery.championPointsSinceLastLevel + mastery.championPointsUntilNextLevel)}
                </span>
                            </div>
                            <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 rounded-full"
                                    style={{ width: `${getProgressPercentage()}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Show Matches Button */}
                    <button
                        onClick={() => setShowMatchModal(true)}
                        className="mt-4 w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium
              hover:from-blue-700 hover:to-purple-700 transition-all duration-200 rounded-lg
              flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                        aria-label={`Show match history for ${championName}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Show Matches
                    </button>
                </div>
            </article>

            {/* Match History Modal */}
            <Modal
                isOpen={showMatchModal}
                onClose={() => setShowMatchModal(false)}
                title={`${championName} - Match History`}
            >
                <MatchHistory
                    championId={mastery.championId}
                    summonerInfo={summonerInfo}
                    championName={championName}
                />
            </Modal>
        </>
    );
};

export default ChampionCard;