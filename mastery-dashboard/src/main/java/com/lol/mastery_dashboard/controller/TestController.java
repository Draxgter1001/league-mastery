package com.lol.mastery_dashboard.controller;

import com.lol.mastery_dashboard.dto.riot.AccountDto;
import com.lol.mastery_dashboard.dto.riot.ChampionMasteryDto;
import com.lol.mastery_dashboard.dto.riot.SummonerDto;
import com.lol.mastery_dashboard.service.RiotApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final RiotApiService riotApiService;

    @GetMapping("/account/{gameName}/{tagLine}")
    public AccountDto testAccount(@PathVariable String gameName, @PathVariable String tagLine){
        return riotApiService.getAccountByRiotId(gameName, tagLine);
    }

    @GetMapping("/summoner/{puuid}")
    public SummonerDto testSummoner(@PathVariable String puuid, @RequestParam String region){
        return riotApiService.getSummonerByPuuid(puuid, region);
    }

    @GetMapping("/masteries/{puuid}")
    public List<ChampionMasteryDto> testMasteries(@PathVariable String puuid, @RequestParam String region){
        return riotApiService.getChampionMasteries(puuid, region);
    }

}
