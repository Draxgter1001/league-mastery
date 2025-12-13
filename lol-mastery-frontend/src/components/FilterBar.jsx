function FilterBar({
    sortBy,
    setSortBy,
    filterLevel,
    setFilterLevel,
    showChestsOnly,
    setShowChestsOnly,
    searchTerm,
    setSearchTerm
}) {
    return (
        <div className="bg-gray-800 rounded-lg p-4 mb-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search Bar */}
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Search Champion</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Type champion name..."
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Sort By */}
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Sort By</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="points-desc">Highest Points</option>
                        <option value="points-asc">Lowest Points</option>
                        <option value="level-desc">Highest Level</option>
                        <option value="level-asc">Lowest Level</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                    </select>
                </div>

                {/* Filter by Level */}
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Mastery Level</label>
                    <select
                        value={filterLevel}
                        onChange={(e) => setFilterLevel(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Levels</option>
                        <option value="7">Level 7</option>
                        <option value="6">Level 6</option>
                        <option value="5">Level 5</option>
                        <option value="4">Level 4</option>
                        <option value="3">Level 3</option>
                        <option value="2">Level 2</option>
                        <option value="1">Level 1</option>
                    </select>
                </div>

                {/* Chest Filter with Explanation */}
                <div>
                    <label className="block text-sm text-gray-400 mb-2">
                        Show
                        <span className="ml-2 text-xs text-gray-500 cursor-help" title="Shows champions where you can earn a chest this season (if you haven't hit your weekly limit)">
                        ℹ️
                        </span>
                    </label>
                    <button
                        onClick={() => setShowChestsOnly(!showChestsOnly)}
                        className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            showChestsOnly
                                ? 'bg-yellow-500 text-gray-900'
                                : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                    >
                        {showChestsOnly ? '📦 Chests Available' : 'All Champions'}
                    </button>
                    {showChestsOnly && (
                        <p className="text-xs text-gray-500 mt-1">
                            Note: Limited to 1 chest/week
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FilterBar;