package com.lol.mastery_dashboard.dto.riot;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class MatchDto {
    private Metadata metadata;
    private Info info;

    @Data
    public static class Metadata{
        @JsonProperty("matchId")
        private String matchId;

        @JsonProperty("participants")
        private List<String> participants;
    }

    @Data
    public static class Info {
        @JsonProperty("gameCreation")
        private long gameCreation;

        @JsonProperty("gameDuration")
        private long gameDuration;

        @JsonProperty("gameMode")
        private String gameMode;

        @JsonProperty("queueId")
        private int queueId;

        @JsonProperty("participants")
        private List<Participant> participants;
    }

    @Data
    public static class Participant {
        @JsonProperty("puuid")
        private String puuid;

        @JsonProperty("championId")
        private int championId;

        @JsonProperty("championName")
        private String championName;

        @JsonProperty("kills")
        private int kills;

        @JsonProperty("deaths")
        private int deaths;

        @JsonProperty("assists")
        private int assists;

        @JsonProperty("win")
        private boolean win;

        @JsonProperty("champLevel")
        private int champLevel;

        @JsonProperty("totalMinionsKilled")
        private int totalMinionsKilled;

        @JsonProperty("neutralMinionsKilled")
        private int neutralMinionsKilled;

        @JsonProperty("goldEarned")
        private int goldEarned;

        @JsonProperty("lane")
        private String lane;

        @JsonProperty("role")
        private String role;

        @JsonProperty("teamPosition")
        private String teamPosition;
    }
}
