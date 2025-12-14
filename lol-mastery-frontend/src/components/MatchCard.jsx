import { formatMasteryPoints } from '../utils/championData';

function MatchCard({ match }) {
    // Format game duration from seconds to MM:SS
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Format date to readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    // Get KDA color based on value
    const getKDAColor = (kda) => {
        if (kda >= 5) return 'text-yellow-400';
        if (kda >= 3) return 'text-green-400';
        if (kda >= 2) return 'text-blue-400';
        return 'text-gray-400';
    };

    return (
        <div className={`rounded-lg p-3 border-2 transition-all duration-200 ${
            match.win
                ? 'bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50'
                : 'bg-red-500/10 border-red-500/30 hover:border-red-500/50'
        }`}>
            {/* Header: Win/Loss & Game Mode */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
          <span className={`font-bold text-sm ${match.win ? 'text-blue-400' : 'text-red-400'}`}>
            {match.win ? '✓ Victory' : '✗ Defeat'}
          </span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-400">{match.gameMode}</span>
                </div>
                <span className="text-xs text-gray-500">{formatDate(match.gameDate)}</span>
            </div>

            {/* KDA & Stats */}
            <div className="grid grid-cols-3 gap-2 mb-2">
                {/* KDA */}
                <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">KDA</div>
                    <div className={`text-sm font-bold ${getKDAColor(match.kda)}`}>
                        {match.kda.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-600">
                        {match.kills}/{match.deaths}/{match.assists}
                    </div>
                </div>

                {/* CS */}
                <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">CS</div>
                    <div className="text-sm font-semibold text-purple-400">
                        {match.totalMinionsKilled}
                    </div>
                    <div className="text-xs text-gray-600">
                        {formatDuration(match.gameDuration)}
                    </div>
                </div>

                {/* Gold */}
                <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Gold</div>
                    <div className="text-sm font-semibold text-yellow-400">
                        {(match.goldEarned / 1000).toFixed(1)}k
                    </div>
                    <div className="text-xs text-gray-600">
                        Level {match.championLevel}
                    </div>
                </div>
            </div>

            {/* Lane/Role */}
            {match.lane && match.lane !== 'NONE' && (
                <div className="text-xs text-gray-500 text-center">
                    {match.lane.charAt(0) + match.lane.slice(1).toLowerCase()}
                </div>
            )}
        </div>
    );
}

export default MatchCard;