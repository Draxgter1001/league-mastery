import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const summonerApi = {
    searchSummoner: (gameName, tagLine, region) =>
        apiClient.get(`/summoners/${gameName}/${tagLine}`, { params: {region} }),

    getMasteries: (puuid) =>
        apiClient.get(`/summoners/${puuid}/masteries`),
};

export default apiClient;