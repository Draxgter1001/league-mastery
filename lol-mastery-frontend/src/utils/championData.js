export const DD_VERSION = import.meta.env.VITE_DD_VERSION || '15.24.1';
export const DD_BASE_URL = 'https://ddragon.leagueoflegends.com/cdn';

// Cache for champion data
let championDataCache = null;

/**
 * Fetch all champion data from Data Dragon
 * This runs once and caches the result
 */
export const fetchChampionData = async () => {
    // Return cached data if available
    if (championDataCache) {
        return championDataCache;
    }

    try {
        const response = await fetch(
            `${DD_BASE_URL}/${DD_VERSION}/data/en_US/champion.json`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch champion data');
        }

        const data = await response.json();

        // Transform the data into a simple ID -> Name mapping
        const championMap = {};
        Object.values(data.data).forEach((champion) => {
            championMap[champion.key] = champion.id; // key is the numeric ID, id is the name
        });

        // Cache the result
        championDataCache = championMap;
        return championMap;

    } catch (error) {
        console.error('Error fetching champion data:', error);
        // Return empty object if fetch fails
        return {};
    }
};

/**
 * Get champion name from ID
 * Uses cached data - make sure fetchChampionData() was called first!
 */
export const getChampionName = (championId) => {
    if (!championDataCache) {
        console.warn('Champion data not loaded yet!');
        return `Champion ${championId}`;
    }
    return championDataCache[championId] || `Champion ${championId}`;
};

/**
 * Get champion image URL
 */
export const getChampionImageUrl = (championId) => {
    const championName = getChampionName(championId);
    return `${DD_BASE_URL}/${DD_VERSION}/img/champion/${championName}.png`;
};

/**
 * Get mastery level color gradient
 */
export const getMasteryLevelColor = (level) => {
    const colors = {
        7: 'from-yellow-400 to-yellow-600',
        6: 'from-purple-400 to-purple-600',
        5: 'from-blue-400 to-blue-600',
        4: 'from-green-400 to-green-600',
        3: 'from-teal-400 to-teal-600',
        2: 'from-gray-400 to-gray-600',
        1: 'from-gray-300 to-gray-500',
    };
    return colors[level] || 'from-gray-200 to-gray-400';
};

/**
 * Format mastery points with commas
 */
export const formatMasteryPoints = (points) => {
    return points.toLocaleString();
};