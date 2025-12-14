package com.lol.mastery_dashboard.service;

import com.lol.mastery_dashboard.dto.response.ChampionMasteryResponse;
import com.lol.mastery_dashboard.dto.response.SummonerResponse;
import com.lol.mastery_dashboard.dto.riot.AccountDto;
import com.lol.mastery_dashboard.dto.riot.ChampionMasteryDto;
import com.lol.mastery_dashboard.dto.riot.SummonerDto;
import com.lol.mastery_dashboard.entity.ChampionMastery;
import com.lol.mastery_dashboard.entity.Summoner;
import com.lol.mastery_dashboard.repository.ChampionMasteryRepository;
import com.lol.mastery_dashboard.repository.SummonerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SummonerService {
    private final RiotApiService riotApiService;
    private final SummonerRepository summonerRepository;
    private final ChampionMasteryRepository championMasteryRepository;

    /*
    Main method to find or create a summoner with all the mastery data
     */

    @Transactional
    public SummonerResponse findOrCreateSummoner(String gameName, String tagLine, String region){
        log.info("Processing summoner request: {}#{} ({})", gameName, tagLine, region);

        Summoner existingSummoner = summonerRepository
                .findByGameNameAndTagLineAndRegion(gameName, tagLine, region)
                .orElse(null);

        if(existingSummoner != null && isDataFresh(existingSummoner)){
            log.info("Using cached summoner data from database");
            return mapToResponse(existingSummoner);
        }

        log.info("Fetching fresh data from Riot API");
        AccountDto accountDto = riotApiService.getAccountByRiotId(gameName, tagLine);
        SummonerDto summonerDto = riotApiService.getSummonerByPuuid(accountDto.getPuuid(), region);
        List<ChampionMasteryDto> masteriesDto = riotApiService.getChampionMasteries(accountDto.getPuuid(), region);

        Summoner summoner = saveOrUpdateSummoner(accountDto, summonerDto, region, masteriesDto);
        return mapToResponse(summoner);
    }

    /*
    Checking if the data is less than 5 minutes old
     */

    private boolean isDataFresh(Summoner summoner){
        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);
        return summoner.getLastUpdated().isAfter(fiveMinutesAgo);
    }

    /*
    Save or update summoner and all masteries
     */

    @Transactional
    protected Summoner saveOrUpdateSummoner(
            AccountDto accountDto,
            SummonerDto summonerDto,
            String region,
            List<ChampionMasteryDto> masteriesDto
    ){
        Summoner summoner = summonerRepository.findById(accountDto.getPuuid()).orElse(new Summoner());

        summoner.setPuuid(accountDto.getPuuid());
        summoner.setGameName(accountDto.getGameName());
        summoner.setTagLine(accountDto.getTagLine());
        summoner.setRegion(region);
        summoner.setProfileIconId(summonerDto.getProfileIconId());
        summoner.setSummonerLevel(summonerDto.getSummonerLevel());
        summoner.setLastUpdated(LocalDateTime.now());

        summoner = summonerRepository.save(summoner);

        championMasteryRepository.deleteBySummonerPuuid(summoner.getPuuid());

        final Summoner savedSummoner = summoner;
        List<ChampionMastery> masteries = masteriesDto.stream()
                .map(dto -> mapToMasteryEntity(dto, savedSummoner))
                .collect(Collectors.toList());

        championMasteryRepository.saveAll(masteries);
        summoner.setChampionMasteries(masteries);

        log.info("Saved summoner {} with {} masteries", summoner.getGameName(), masteries.size());
        return summoner;
    }

    /*
    Map Riot DTO to JPA Entity
     */

    private ChampionMastery mapToMasteryEntity(ChampionMasteryDto dto, Summoner summoner){
        ChampionMastery mastery = new ChampionMastery();
        mastery.setSummoner(summoner);
        mastery.setChampionId(dto.getChampionId());
        mastery.setChampionLevel(dto.getChampionLevel());
        mastery.setChampionPoints(dto.getChampionPoints());
        mastery.setChampionPointsSinceLastLevel(dto.getChampionPointsSinceLastLevel());
        mastery.setChampionPointsUntilNextLevel(dto.getChampionPointsUntilNextLevel());
        mastery.setChestGranted(dto.getChestGranted() != null ? dto.getChestGranted() : false);
        mastery.setTokensEarned(dto.getTokensEarned());
        mastery.setLastPlayTime(dto.getLastPlayTime());
        return mastery;
    }

    /*
    Map Entity to response DTO
     */

    private SummonerResponse mapToResponse(Summoner summoner){
        List<ChampionMasteryResponse> masteries = summoner.getChampionMasteries().stream()
                .map(this::mapToMasteryResponse)
                .collect(Collectors.toList());

        int totalMasteryScore = masteries.stream()
                .mapToInt(ChampionMasteryResponse::getChampionLevel)
                .sum();

        int chestAvailable = (int) masteries.stream()
                .filter(m -> !m.getChestGranted())
                .count();

        return SummonerResponse.builder()
                .puuid(summoner.getPuuid())
                .gameName(summoner.getGameName())
                .tagLine(summoner.getTagLine())
                .region(summoner.getRegion())
                .profileIconId(summoner.getProfileIconId())
                .summonerLevel(summoner.getSummonerLevel())
                .lastUpdated(summoner.getLastUpdated())
                .championMasteries(masteries)
                .totalMasteryScore(totalMasteryScore)
                .chestsAvailable(chestAvailable)
                .build();
    }

    /*
    Map mastery entity to response DTO
     */

    private ChampionMasteryResponse mapToMasteryResponse(ChampionMastery mastery){
        return ChampionMasteryResponse.builder()
                .championId(mastery.getChampionId())
                .championLevel(mastery.getChampionLevel())
                .championPoints(mastery.getChampionPoints())
                .championPointsSinceLastLevel(mastery.getChampionPointsSinceLastLevel())
                .championPointsUntilNextLevel(mastery.getChampionPointsUntilNextLevel())
                .chestGranted(mastery.getChestGranted())
                .tokensEarned(mastery.getTokensEarned())
                .lastPlayTime(mastery.getLastPlayTime())
                .isChestAvailable(!mastery.getChestGranted())
                .build();
    }

    /**
     * Get summoner PUUID without refreshing mastery data
     * Used for match history lookups to avoid unnecessary database operations
     */
    public String getPuuidOnly(String gameName, String tagLine, String region) {
        log.info("Getting PUUID for {}#{} in {}", gameName, tagLine, region);

        String normalizedRegion = region.toUpperCase();

        // Check if we already have this summoner in database
        java.util.Optional<Summoner> existingSummoner = summonerRepository
                .findByGameNameAndTagLineAndRegion(gameName, tagLine, normalizedRegion);

        if (existingSummoner.isPresent()) {
            // Return cached PUUID
            log.info("Found cached summoner with PUUID: {}", existingSummoner.get().getPuuid());
            return existingSummoner.get().getPuuid();
        }

        // If not in database, fetch from Riot API
        log.info("Summoner not in cache, fetching from Riot API");
        AccountDto accountDto = riotApiService.getAccountByRiotId(gameName, tagLine);

        if (accountDto == null) {
            throw new RuntimeException("Summoner not found: " + gameName + "#" + tagLine);
        }

        return accountDto.getPuuid();
    }
}
