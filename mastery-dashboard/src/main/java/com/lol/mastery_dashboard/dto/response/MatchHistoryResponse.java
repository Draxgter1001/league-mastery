package com.lol.mastery_dashboard.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class MatchHistoryResponse {
    private String championName;
    private int championId;
    private List<MatchSummary> recentMatches;
    private MatchStats overallStats;

    @Data
    @Builder
    public static class MatchSummary {
        private String matchId;
        private LocalDateTime gameDate;
        private String gameMode;
        private int gameDuration; // in seconds
        private boolean win;
        private int kills;
        private int deaths;
        private int assists;
        private double kda;
        private int championLevel;
        private int totalMinionsKilled;
        private int goldEarned;
        private String lane;
        private String role;
    }

    @Data
    @Builder
    public static class MatchStats {
        private int totalGames;
        private int wins;
        private int losses;
        private double winRate;
        private double averageKDA;
        private double averageKills;
        private double averageDeaths;
        private double averageAssists;
    }
}
