import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const summonerApi = {
    searchSummoner: async (gameName, tagLine, region) => {
        try{
            const response = await apiClient.get(
                `/summoners/${gameName}/${tagLine}`,
                { params: { region }}
            );
            return response.data;
        } catch(error){
            throw error;
        }
    }
};

export default apiClient;