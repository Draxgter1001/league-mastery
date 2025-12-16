import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

export const summonerApi = {
    searchSummoner: async (gameName, tagLine, region) => {
        try{
            const response = await apiClient.get(
                `/summoners/${gameName}/${tagLine}`,
                { params: { region: region.toLowerCase() }}
            );
            return response.data;
        } catch(error){
            throw error;
        }
    },

    getChampionMatches: async (gameName, tagLine, championId, region, count = 10) => {
        try{
            const response = await apiClient.get(
                `/summoners/${gameName}/${tagLine}/champion/${championId}/matches`,
                { params: {region: region.toLowerCase(), count} }
            );
            return response.data;
        }catch (error) {
            console.error(`Error fetching matches for champion ${championId}:`, error);
            throw error;
        }
    }
};

export default apiClient;