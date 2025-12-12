package com.lol.mastery_dashboard.dto.riot;

import lombok.Data;

@Data
public class SummonerDto {
    private String id;
    private String accountId;
    private String puuid;
    private String name;
    private Integer profileIconId;
    private Long summonerLevel;
    private Long revisionDate;
}
