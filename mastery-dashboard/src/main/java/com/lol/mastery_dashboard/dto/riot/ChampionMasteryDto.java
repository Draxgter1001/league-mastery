package com.lol.mastery_dashboard.dto.riot;

import lombok.Data;

@Data
public class ChampionMasteryDto {
    private String puuid;
    private Integer championId;
    private Integer championLevel;
    private Long championPoints;
    private Long lastPlayTime;
    private Integer championPointsSinceLastLevel;
    private Integer championPointsUntilNextLevel;
    private Boolean chestGranted;
    private Integer tokensEarned;
    private Long championSeasonMilestone;
    private Integer markRequiredForNextLevel;
}
