package com.lol.mastery_dashboard.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SummonerResponse {
    private String puuid;
    private String gameName;
    private String tagLine;
    private String  region;
    private Integer profileIconId;
    private Long summonerLevel;
    private LocalDateTime lastUpdated;
    private List<ChampionMasteryResponse> championMasteries;

    private Integer totalMasteryScore;
    private Integer chestsAvailable;
}
