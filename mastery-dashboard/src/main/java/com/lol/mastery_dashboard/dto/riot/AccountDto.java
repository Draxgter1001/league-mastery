package com.lol.mastery_dashboard.dto.riot;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AccountDto {
    private String puuid;

    @JsonProperty("gameName")
    private String gameName;

    @JsonProperty("tagLine")
    private String tagLine;
}
