import { useState } from 'react';
import { getChampionImageUrl, getChampionName, getMasteryLevelColor, formatMasteryPoints } from '../utils/championData';
import LazyImage from './LazyImage';
import MatchHistory from './MatchHistory';

function ChampionCard({ mastery, summonerInfo }) {
    const [showMatches, setShowMatches] = useState(false);

    const championName = getChampionName(mastery.championId);
    const imageUrl = getChampionImageUrl(mastery.championId);
    const levelColor = getMasteryLevelColor(mastery.championLevel);

    const progress = mastery.championPointsUntilNextLevel === null
        ? 100
        : mastery.championPointsSinceLastLevel === null
            ? 0
            : (mastery.championPointsSinceLastLevel / (mastery.championPointsSinceLastLevel + mastery.championPointsUntilNextLevel)) * 100;

    return (
        <div className="group bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 transform">
            {/* Champion Image */}
            <div className="relative overflow-hidden">
                <LazyImage
                    src={imageUrl}
                    alt={championName}
                    className="w-full h-28 md:h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/Aatrox.png';
                    }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300" />

                {/* Mastery Level Badge */}
                <div className={`absolute top-2 right-2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${levelColor} flex items-center justify-center font-bold text-white shadow-lg border-2 border-white group-hover:scale-125 transition-transform duration-300`}>
                    <span className="text-xs md:text-sm">{mastery.championLevel}</span>
                </div>

                {/* Chest Available Indicator */}
                {mastery.isChestAvailable && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-xs px-2 py-1 rounded-full font-semibold shadow-lg animate-pulse">
                        📦
                    </div>
                )}
            </div>

            {/* Champion Info */}
            <div className="p-2 md:p-3">
                <h3 className="font-bold text-white text-xs md:text-sm mb-2 truncate group-hover:text-blue-400 transition-colors">
                    {championName}
                </h3>

                {/* Mastery Points */}
                <div className="text-xs text-gray-400 mb-2">
          <span className="font-semibold text-blue-400">
            {formatMasteryPoints(mastery.championPoints)}
          </span> pts
                </div>

                {/* Progress Bar or Level Up Status */}
                {mastery.championPointsUntilNextLevel !== null && mastery.championPointsUntilNextLevel !== 0 ? (
                    <div className="mb-1">
                        {mastery.championPointsUntilNextLevel < 0 ? (
                            <div className="bg-yellow-500/20 border border-yellow-500 rounded px-2 py-1">
                                <div className="text-xs text-yellow-400 font-semibold">
                                    ⭐ Ready to level up!
                                </div>
                                <div className="text-xs text-yellow-300">
                                    Need {mastery.championLevel >= 6 ? 'tokens' : 'to play more'}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-full bg-gray-700 rounded-full h-1.5 md:h-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500 group-hover:from-blue-400 group-hover:to-purple-400"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {formatMasteryPoints(mastery.championPointsUntilNextLevel)} to Lv {mastery.championLevel + 1}
                                </div>
                            </>
                        )}
                    </div>
                ) : mastery.championLevel >= 7 && mastery.championPointsUntilNextLevel === 0 ? (
                    <div className="text-xs text-yellow-400 font-semibold">
                        ⭐ Max Level!
                    </div>
                ) : null}

                {/* Tokens */}
                {mastery.tokensEarned > 0 && (
                    <div className="text-xs text-purple-400 mt-1 flex items-center gap-1">
                        <span>🏅</span>
                        <span>{mastery.tokensEarned} token{mastery.tokensEarned > 1 ? 's' : ''}</span>
                    </div>
                )}

                {/* Show Match History Button */}
                <button
                    onClick={() => setShowMatches(!showMatches)}
                    className="w-full mt-3 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1"
                >
                    <span>{showMatches ? '▼' : '▶'}</span>
                    <span>{showMatches ? 'Hide' : 'Show'} Matches</span>
                </button>
            </div>

            {/* Expandable Match History */}
            {showMatches && summonerInfo && (
                <div className="border-t border-gray-700 p-3 bg-gray-900/50">
                    <MatchHistory
                        gameName={summonerInfo.gameName}
                        tagLine={summonerInfo.tagLine}
                        championId={mastery.championId}
                        region={summonerInfo.region}
                    />
                </div>
            )}
        </div>
    );
}

export default ChampionCard;