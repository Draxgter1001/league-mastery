package com.lol.mastery_dashboard.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChampionMasteryResponse {
    private Integer championId;
    private Integer championLevel;
    private Long championPoints;
    private Integer championPointsSinceLastLevel;
    private Integer championPointsUntilNextLevel;
    private Boolean chestGranted;
    private Integer tokensEarned;
    private Long lastPlayTime;

    private Boolean isChestAvailable;
}
