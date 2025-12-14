package com.lol.mastery_dashboard.service;

import com.lol.mastery_dashboard.config.RiotApiProperties;
import com.lol.mastery_dashboard.dto.riot.AccountDto;
import com.lol.mastery_dashboard.dto.riot.ChampionMasteryDto;
import com.lol.mastery_dashboard.dto.riot.SummonerDto;
import com.lol.mastery_dashboard.dto.riot.MatchDto;
import com.lol.mastery_dashboard.util.RegionMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.core.ParameterizedTypeReference;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j //Used for Logging
public class RiotApiService {

    private final RiotApiProperties riotApiProperties;
    private final WebClient.Builder webClientBuilder;

    /*
    Getting Account by Riot ID (GameName#TagLine)
    Using Account-V1 API on Americas Routing
     */

    @Cacheable(value = "accounts", key = "#gameName + '_' + #tagLine")
    public AccountDto getAccountByRiotId(String gameName, String tagLine){
        log.info("Fetching account for: {}#{}", gameName, tagLine);

        try{
            WebClient webClient = webClientBuilder
                    .baseUrl(riotApiProperties.getAccountUrl())
                    .defaultHeader("X-Riot-Token", riotApiProperties.getKey())
                    .build();
            return webClient.get()
                    .uri("/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}", gameName, tagLine)
                    .retrieve()
                    .bodyToMono(AccountDto.class)
                    .block();
        }catch (WebClientResponseException.NotFound e){
            log.error("Summoner not found: {}#{}", gameName, tagLine);
            throw new RuntimeException("Summoner not found: " + gameName + "#" + tagLine);
        }catch (Exception e){
            log.error("Error fetching account: ", e);
            throw new RuntimeException("Failed to fetch account data", e);
        }
    }

    /*
    Getting Summoner Details by PUUID
    Using Summoner-V4 API on regional endpoint
     */

    @Cacheable(value = "summoners", key = "#puuid + '_' + #region")
    public SummonerDto getSummonerByPuuid(String puuid, String region){
        log.info("Fetching summoner for PUUID: {} in region: {}", puuid, region);

        try {
            String regionalUrl = riotApiProperties.getSummonerUrl().replace("{region}", region.toLowerCase());

            WebClient webClient = webClientBuilder
                    .baseUrl(regionalUrl)
                    .defaultHeader("X-Riot-Token", riotApiProperties.getKey())
                    .build();

            return webClient.get()
                    .uri("/lol/summoner/v4/summoners/by-puuid/{puuid}", puuid)
                    .retrieve()
                    .bodyToMono(SummonerDto.class)
                    .block();
        }catch (Exception e){
            log.error("Error fetching summoner: ", e);
            throw new RuntimeException("Failed to fetch summoner data: ", e);
        }
    }

    /*
    Getting all champion masteries for a summoner
    Using Champion-Mastery-V4 API
     */

    @Cacheable(value = "masteries", key = "#puuid + '_' + #region")
    public List<ChampionMasteryDto> getChampionMasteries(String puuid, String region){
        log.info("Fetching masteries for PUUID: {} in region: {}", puuid, region);

        try {
            String regionalUrl = riotApiProperties.getSummonerUrl().replace("{region}", region.toLowerCase());

            WebClient webClient = webClientBuilder
                    .baseUrl(regionalUrl)
                    .defaultHeader("X-Riot-Token", riotApiProperties.getKey())
                    .build();

            return webClient.get()
                    .uri("/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}", puuid)
                    .retrieve()
                    .bodyToFlux(ChampionMasteryDto.class)
                    .collectList()
                    .block();
        }catch (Exception e){
            log.error("Error fetching masteries: ", e);
            throw new RuntimeException("Failed fetching champion masteries: ", e);
        }
    }

    @Cacheable(value = "matchIds", key = "#puuid + '-' + #region + '-' + #count")
    public List<String> getMatchIdsByPuuid(String puuid, String region, int count){
        log.info("Fetching match IDs for PUUID: {} in region: {}", puuid, region);

        String matchApiUrl = RegionMapper.getMatchApiUrl(region);

        try {
            WebClient webClient = webClientBuilder
                    .baseUrl(matchApiUrl)
                    .defaultHeader("X-Riot-Token", riotApiProperties.getKey())
                    .build();

            List<String> matchIds = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/lol/match/v5/matches/by-puuid/{puuid}/ids")
                            .queryParam("start", 0)
                            .queryParam("count", count)
                            .build(puuid))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<String>>() {})
                    .block();

            log.info("Found {} matches for PUUID: {}", matchIds != null ? matchIds.size() : 0, puuid);
            return matchIds;
        }catch (WebClientResponseException.NotFound e){
            log.error("Match history not found for PUUID: {}", puuid);
            return List.of();
        }catch (Exception e){
            log.error("Error fetchign match IDs: ", e);
            throw new RuntimeException("Failed to fetch match IDs: " + e.getMessage());
        }
    }

    @Cacheable(value = "matches", key = "#matchId + '-' + #region")
    public MatchDto getMatchDetails(String matchId, String region){
        log.info("Fetching match details for: {}", matchId);

        String matchApiUrl = RegionMapper.getMatchApiUrl(region);

        try {
            WebClient webClient = webClientBuilder
                    .baseUrl(matchApiUrl)
                    .defaultHeader("X-Riot-Token", riotApiProperties.getKey())
                    .build();

            MatchDto match = webClient.get()
                    .uri("/lol/match/v5/matches/{matchId}", matchId)
                    .retrieve()
                    .bodyToMono(MatchDto.class)
                    .block();

            log.info("Successfully fetched match: {}",matchId);
            return match;
        }catch (WebClientResponseException.NotFound e){
            log.error("Match not found: {}", matchId);
            return null;
        }catch (Exception e){
            log.error("Error fetching match details: ", e);
            throw new RuntimeException("Failed to fetch match details: " + e.getMessage());
        }
    }

}
