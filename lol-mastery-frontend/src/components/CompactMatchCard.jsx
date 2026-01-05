import { getChampionImageUrl, getChampionName } from '../utils/championData';

const CompactMatchCard = ({ match }) => {
    // Use environment variable or fallback version
    const DD_VERSION = import.meta.env.VITE_DD_VERSION || '14.23.1';

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return date.toLocaleDateString();
    };

    const getKDAColor = (kda) => {
        if (kda >= 5) return 'text-yellow-400';
        if (kda >= 3) return 'text-green-400';
        if (kda >= 2) return 'text-blue-400';
        return 'text-slate-400';
    };

    const championName = getChampionName(match.championId);
    const bgColor = match.win
        ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/30 border-blue-500/30'
        : 'bg-gradient-to-r from-red-900/40 to-red-800/30 border-red-500/30';

    return (
        <div className={`flex items-center gap-4 p-3 rounded-lg border ${bgColor} hover:scale-[1.01] transition-transform`}>
            {/* Champion Image */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img
                    src={getChampionImageUrl(match.championId, DD_VERSION)}
                    alt={championName}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 right-0 bg-slate-900/90 text-white text-xs px-1 rounded-tl">
                    {match.championLevel}
                </div>
            </div>

            {/* Match Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm font-bold ${match.win ? 'text-blue-400' : 'text-red-400'}`}>
            {match.win ? 'Victory' : 'Defeat'}
          </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-400 truncate">{match.gameMode}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                    <span className="font-semibold">{championName}</span>
                    <span className="text-slate-500">•</span>
                    <span>{formatDuration(match.gameDuration)}</span>
                    <span className="text-slate-500">•</span>
                    <span>{formatDate(match.gameDate)}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-center">
                    <div className={`text-lg font-bold ${getKDAColor(match.kda)}`}>
                        {match.kda.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400">KDA</div>
                </div>
                <div className="text-center">
                    <div className="text-sm font-semibold text-slate-300">
                        {match.kills}/{match.deaths}/{match.assists}
                    </div>
                    <div className="text-xs text-slate-400">K/D/A</div>
                </div>
                <div className="text-center">
                    <div className="text-sm font-semibold text-slate-300">{match.totalMinionsKilled}</div>
                    <div className="text-xs text-slate-400">CS</div>
                </div>
            </div>
        </div>
    );
};

export default CompactMatchCard;