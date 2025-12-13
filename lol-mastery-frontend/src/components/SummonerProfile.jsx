function SummonerProfile({ summoner }) {
    const profileIconUrl = `https://ddragon.leagueoflegends.com/cdn/14.23.1/img/profileicon/${summoner.profileIconId}.png`;

    return (
        <>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-6 shadow-xl">
                <div className="flex items-center gap-6">
                    {/* Profile Icon */}
                    <img
                        src={profileIconUrl}
                        alt="Profile Icon"
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                    />

                    {/* Summoner Info */}
                    <div className="flex-1 text-white">
                        <h1 className="text-3xl font-bold mb-2">
                            {summoner.gameName}
                            <span className="text-blue-200">#{summoner.tagLine}</span>
                        </h1>
                        <div className="flex gap-6 text-sm flex-wrap">
                            <div>
                                <span className="text-blue-200">Level:</span>{' '}
                                <span className="font-semibold">{summoner.summonerLevel}</span>
                            </div>
                            <div>
                                <span className="text-blue-200">Region:</span>{' '}
                                <span className="font-semibold">{summoner.region}</span>
                            </div>
                            <div>
                                <span className="text-blue-200">Total Mastery Score:</span>{' '}
                                <span className="font-semibold">{summoner.totalMasteryScore}</span>
                            </div>
                            <div>
                                <span className="text-blue-200">Chests Available:</span>{' '}
                                <span className="font-semibold text-yellow-300">📦 {summoner.chestsAvailable}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chest Explanation */}
            {summoner.chestsAvailable > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">📦</div>
                        <div className="flex-1">
                            <h3 className="text-yellow-400 font-semibold mb-1">
                                About Hextech Chests
                            </h3>
                            <p className="text-sm text-gray-300">
                                You have <span className="font-bold text-yellow-400">{summoner.chestsAvailable}</span> champion(s)
                                where you can earn a chest this season. Remember:
                            </p>
                            <ul className="text-xs text-gray-400 mt-2 space-y-1 ml-4">
                                <li>• You can earn 1 chest per week (max 4 stored)</li>
                                <li>• You need an S-, S, or S+ grade to earn a chest</li>
                                <li>• Only 1 chest per champion per season</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SummonerProfile;