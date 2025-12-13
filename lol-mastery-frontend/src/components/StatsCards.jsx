function StatsCards({ summoner, filteredCount, totalCount }) {
    const stats = [
        {
            label: 'Total Mastery Score',
            value: summoner.totalMasteryScore.toLocaleString(),
            icon: '🏆',
            color: 'from-yellow-400 to-orange-500',
        },
        {
            label: 'Champions Played',
            value: totalCount,
            icon: '🎮',
            color: 'from-blue-400 to-purple-500',
        },
        {
            label: 'Chests Available',
            value: summoner.chestsAvailable,
            icon: '📦',
            color: 'from-green-400 to-teal-500',
        },
        {
            label: 'Summoner Level',
            value: summoner.summonerLevel,
            icon: '⭐',
            color: 'from-pink-400 to-red-500',
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-gray-800 rounded-lg p-4 shadow-lg hover:scale-105 transition-transform duration-200"
                >
                    <div className={`text-4xl mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
            ))}

            {filteredCount < totalCount && (
                <div className="col-span-2 md:col-span-4 bg-blue-500/20 border border-blue-500 text-blue-200 px-4 py-3 rounded-lg text-center">
                    Showing {filteredCount} of {totalCount} champions
                </div>
            )}
        </div>
    );
}

export default StatsCards;