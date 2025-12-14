package com.lol.mastery_dashboard.service;

import com.lol.mastery_dashboard.dto.response.MatchHistoryResponse;
import com.lol.mastery_dashboard.dto.riot.MatchDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchService {

    private final RiotApiService riotApiService;

    public MatchHistoryResponse getChampionMatchHistory(String puuid, String region, int championId, int matchCount) {
        log.info("Fetching match history for champion {} - PUUID: {}", championId, puuid);

        // Get recent match IDs (fetch more to filter by champion)
        List<String> allMatchIds = riotApiService.getMatchIdsByPuuid(puuid, region, matchCount * 3);

        if (allMatchIds == null || allMatchIds.isEmpty()) {
            return buildEmptyResponse(championId);
        }

        // Fetch match details and filter by champion
        List<MatchHistoryResponse.MatchSummary> championMatches = allMatchIds.stream()
                .map(matchId -> riotApiService.getMatchDetails(matchId, region))
                .filter(Objects::nonNull)
                .map(match -> extractPlayerMatch(match, puuid, championId))
                .filter(Objects::nonNull)
                .limit(matchCount)
                .collect(Collectors.toList());

        // Calculate overall stats
        MatchHistoryResponse.MatchStats stats = calculateStats(championMatches);

        return MatchHistoryResponse.builder()
                .championId(championId)
                .recentMatches(championMatches)
                .overallStats(stats)
                .build();
    }

    private MatchHistoryResponse.MatchSummary extractPlayerMatch(MatchDto match, String puuid, int championId) {
        // Find the participant matching this PUUID
        MatchDto.Participant player = match.getInfo().getParticipants().stream()
                .filter(p -> p.getPuuid().equals(puuid))
                .findFirst()
                .orElse(null);

        if (player == null || player.getChampionId() != championId) {
            return null; // Not this champion
        }

        // Calculate KDA
        double kda = player.getDeaths() == 0
                ? (player.getKills() + player.getAssists())
                : (double) (player.getKills() + player.getAssists()) / player.getDeaths();

        // Convert timestamp to LocalDateTime
        LocalDateTime gameDate = LocalDateTime.ofInstant(
                Instant.ofEpochMilli(match.getInfo().getGameCreation()),
                ZoneId.systemDefault()
        );

        return MatchHistoryResponse.MatchSummary.builder()
                .matchId(match.getMetadata().getMatchId())
                .gameDate(gameDate)
                .gameMode(getGameModeName(match.getInfo().getQueueId()))
                .gameDuration((int) match.getInfo().getGameDuration())
                .win(player.isWin())
                .kills(player.getKills())
                .deaths(player.getDeaths())
                .assists(player.getAssists())
                .kda(Math.round(kda * 100.0) / 100.0) // Round to 2 decimals
                .championLevel(player.getChampLevel())
                .totalMinionsKilled(player.getTotalMinionsKilled() + player.getNeutralMinionsKilled())
                .goldEarned(player.getGoldEarned())
                .lane(player.getTeamPosition())
                .role(player.getRole())
                .build();
    }

    private MatchHistoryResponse.MatchStats calculateStats(List<MatchHistoryResponse.MatchSummary> matches) {
        if (matches.isEmpty()) {
            return MatchHistoryResponse.MatchStats.builder()
                    .totalGames(0)
                    .wins(0)
                    .losses(0)
                    .winRate(0.0)
                    .averageKDA(0.0)
                    .averageKills(0.0)
                    .averageDeaths(0.0)
                    .averageAssists(0.0)
                    .build();
        }

        int totalGames = matches.size();
        int wins = (int) matches.stream().filter(MatchHistoryResponse.MatchSummary::isWin).count();
        int losses = totalGames - wins;
        double winRate = Math.round((double) wins / totalGames * 100 * 10.0) / 10.0;

        double avgKDA = matches.stream()
                .mapToDouble(MatchHistoryResponse.MatchSummary::getKda)
                .average()
                .orElse(0.0);

        double avgKills = matches.stream()
                .mapToDouble(MatchHistoryResponse.MatchSummary::getKills)
                .average()
                .orElse(0.0);

        double avgDeaths = matches.stream()
                .mapToDouble(MatchHistoryResponse.MatchSummary::getDeaths)
                .average()
                .orElse(0.0);

        double avgAssists = matches.stream()
                .mapToDouble(MatchHistoryResponse.MatchSummary::getAssists)
                .average()
                .orElse(0.0);

        return MatchHistoryResponse.MatchStats.builder()
                .totalGames(totalGames)
                .wins(wins)
                .losses(losses)
                .winRate(winRate)
                .averageKDA(Math.round(avgKDA * 100.0) / 100.0)
                .averageKills(Math.round(avgKills * 10.0) / 10.0)
                .averageDeaths(Math.round(avgDeaths * 10.0) / 10.0)
                .averageAssists(Math.round(avgAssists * 10.0) / 10.0)
                .build();
    }

    private MatchHistoryResponse buildEmptyResponse(int championId) {
        return MatchHistoryResponse.builder()
                .championId(championId)
                .recentMatches(List.of())
                .overallStats(MatchHistoryResponse.MatchStats.builder()
                        .totalGames(0)
                        .wins(0)
                        .losses(0)
                        .winRate(0.0)
                        .averageKDA(0.0)
                        .averageKills(0.0)
                        .averageDeaths(0.0)
                        .averageAssists(0.0)
                        .build())
                .build();
    }

    private String getGameModeName(int queueId) {
        return switch (queueId) {
            case 400, 430 -> "Normal";
            case 420 -> "Ranked Solo";
            case 440 -> "Ranked Flex";
            case 450 -> "ARAM";
            case 700 -> "Clash";
            case 900 -> "URF";
            case 1020 -> "One For All";
            case 1300 -> "Nexus Blitz";
            default -> "Custom";
        };
    }
}