package com.lol.mastery_dashboard.service;

import com.lol.mastery_dashboard.config.RiotApiProperties;
import com.lol.mastery_dashboard.dto.riot.AccountDto;
import com.lol.mastery_dashboard.dto.riot.ChampionMasteryDto;
import com.lol.mastery_dashboard.dto.riot.SummonerDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

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

}
