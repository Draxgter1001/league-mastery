package com.lol.mastery_dashboard.config;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "riot.api")
@Data
public class RiotApiProperties {
    private String key;
    private String accountUrl;
    private String summonerUrl;
}
