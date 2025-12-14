package com.lol.mastery_dashboard.util;

public class RegionMapper {
    public static String getRegionalRoute(String platformRegion){
        return switch (platformRegion.toUpperCase()){
            case "NA1", "BR1", "LA1", "LA2" -> "americas";
            case "KR", "JP1" -> "asia";
            case "EUW1", "EUN1", "TR1", "RU", "OC1" -> "europe";
            default -> "americas";
        };
    }

    public static String getMatchApiUrl(String platformRegion) {
        String region = getRegionalRoute(platformRegion);
        return "https://" + region + ".api.riotgames.com";
    }
}
