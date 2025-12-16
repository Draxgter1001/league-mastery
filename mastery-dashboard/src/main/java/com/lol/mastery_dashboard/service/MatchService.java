package com.lol.mastery_dashboard.service;

import com.lol.mastery_dashboard.dto.response.MatchHistoryResponse;
import com.lol.mastery_dashboard.dto.riot.MatchDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MatchService {

    private final RiotApiService riotApiService;

    public MatchHistoryResponse getChampionMatchHistory(String puuid, String region, int championId, int matchCount) {
        log.info("Fetching match history for champion {} - PUUID: {}", championId, puuid);

        List<String> allMatchIds = riotApiService.getMatchIdsByPuuid(puuid, region, Math.min(matchCount * 2, 30));

        if (allMatchIds == null || allMatchIds.isEmpty()) {
            return buildEmptyResponse(championId);
        }

        List<MatchHistoryResponse.MatchSummary> championMatches = new ArrayList<>();
        int processedMatches = 0;

        // Get champion name from first match (or we could maintain a champion mapping)
        String championName = null;

        for (String matchId : allMatchIds) {
            if (championMatches.size() >= matchCount) {
                break;
            }

            try {
                MatchDto match = riotApiService.getMatchDetails(matchId, region);
                if (match != null) {
                    MatchHistoryResponse.MatchSummary summary = extractPlayerMatch(match, puuid, championId);
                    if (summary != null) {
                        championMatches.add(summary);

                        // Get champion name from the match data (Riot provides it)
                        if (championName == null) {
                            championName = getChampionNameFromMatch(match, puuid);
                        }
                    }
                }
                processedMatches++;

                if (processedMatches % 10 == 0) {
                    try {
                        Thread.sleep(50);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }
            } catch (Exception e) {
                log.warn("Failed to fetch match {}: {}", matchId, e.getMessage());
            }
        }

        MatchHistoryResponse.MatchStats stats = calculateStats(championMatches);

        return MatchHistoryResponse.builder()
                .championId(championId)
                .championName(championName)  // ← NOW SET!
                .recentMatches(championMatches)
                .overallStats(stats)
                .build();
    }

    /**
     * Extract champion name from match data
     */
    private String getChampionNameFromMatch(MatchDto match, String puuid) {
        return match.getInfo().getParticipants().stream()
                .filter(p -> p.getPuuid().equals(puuid))
                .findFirst()
                .map(MatchDto.Participant::getChampionName)
                .orElse(null);
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
                .championName(null)  // We don't have matches to extract name from
                .recentMatches(new ArrayList<>())
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

    private String getGameModeName(Integer queueId) {
        log.info("Queue ID: {}", queueId);
        if (queueId == null) {
            return "Unknown";
        }

        return switch (queueId) {
            // Ranked modes
            case 420 -> "Ranked Solo/Duo";
            case 440 -> "Ranked Flex";
            case 470 -> "Ranked Flex 3v3"; // Deprecated but still in history

            // Normal modes
            case 400 -> "Normal Draft";
            case 430 -> "Normal Blind";
            case 490 -> "Normal Quickplay";

            // ARAM & Special modes
            case 450 -> "ARAM";
            case 900 -> "ARURF";
            case 1020 -> "One For All";
            case 1300 -> "Nexus Blitz";
            case 1400 -> "Ultimate Spellbook";
            case 1700 -> "Arena";
            case 1900 -> "URF";

            // Clash
            case 700 -> "Clash";

            // Tutorial & Co-op
            case 830, 840, 850 -> "Co-op vs AI";
            case 2000, 2010, 2020 -> "Tutorial";

            // Custom games
            case 0 -> "Custom";

            // Unknown/Other
            default -> "Custom (Queue " + queueId + ")";
        };
    }
}