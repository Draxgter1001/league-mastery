const MatchCard = ({ match }) => {
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
        if (diffInDays < 7) return `${diffInDays} days ago`;
        return date.toLocaleDateString();
    };

    const getKDAColor = (kda) => {
        if (kda >= 5) return 'text-yellow-400';
        if (kda >= 3) return 'text-green-400';
        if (kda >= 2) return 'text-blue-400';
        return 'text-slate-400';
    };

    const winColor = match.win ? 'from-blue-900/40 to-blue-800/40 border-blue-500/40' : 'from-red-900/40 to-red-800/40 border-red-500/40';

    return (
        <div className={`p-4 rounded-lg bg-gradient-to-r ${winColor} border hover:scale-[1.02] transition-transform`}>
            <div className="flex items-center justify-between">
                {/* Left: Result & Mode */}
                <div className="flex items-center gap-4">
                    <div className={`text-lg font-bold ${match.win ? 'text-blue-400' : 'text-red-400'}`}>
                        {match.win ? '✓ Victory' : '✗ Defeat'}
                    </div>
                    <div className="text-sm text-slate-400">
                        {match.gameMode} • {formatDuration(match.gameDuration)}
                    </div>
                </div>

                {/* Right: Date */}
                <div className="text-sm text-slate-500">
                    {formatDate(match.gameDate)}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="mt-3 grid grid-cols-5 gap-3 text-center">
                <div>
                    <div className={`text-2xl font-bold ${getKDAColor(match.kda)}`}>
                        {match.kda.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400">KDA</div>
                </div>

                <div>
                    <div className="text-lg font-semibold text-slate-300">
                        {match.kills} / <span className="text-red-400">{match.deaths}</span> / {match.assists}
                    </div>
                    <div className="text-xs text-slate-400">K / D / A</div>
                </div>

                <div>
                    <div className="text-lg font-semibold text-slate-300">{match.totalMinionsKilled}</div>
                    <div className="text-xs text-slate-400">CS</div>
                </div>

                <div>
                    <div className="text-lg font-semibold text-yellow-500">{(match.goldEarned / 1000).toFixed(1)}k</div>
                    <div className="text-xs text-slate-400">Gold</div>
                </div>

                <div>
                    <div className="text-lg font-semibold text-purple-400">Lv {match.championLevel}</div>
                    <div className="text-xs text-slate-400">{match.lane}</div>
                </div>
            </div>
        </div>
    );
};

export default MatchCard;