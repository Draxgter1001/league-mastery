package com.lol.mastery_dashboard.controller;

import com.lol.mastery_dashboard.dto.response.SummonerResponse;
import com.lol.mastery_dashboard.service.SummonerService;
import com.lol.mastery_dashboard.dto.response.MatchHistoryResponse;
import com.lol.mastery_dashboard.service.MatchService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/summoners")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class SummonerController {

    private final SummonerService summonerService;
    private final MatchService matchService;

    @GetMapping("/{gameName}/{tagLine}")
    public ResponseEntity<?> getSummoner(
            @PathVariable String gameName,
            @PathVariable String tagLine,
            @RequestParam String region
    ){
        try{
            log.info("Request received: {}#{} ({})", gameName, tagLine, region);
            SummonerResponse response = summonerService.findOrCreateSummoner(gameName, tagLine, region.toUpperCase());

            return ResponseEntity.ok(response);
        }catch (RuntimeException e){
            log.error("Error fetching summoner: ", e);

            if(e.getMessage().contains("not found")){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("Summoner not found: "
                + gameName + "#" + tagLine));
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("Failed to " +
                    "fetch summoner data"));
        }
    }

    @GetMapping("/{gameName}/{tagLine}/champion/{championId}/matches")
    public ResponseEntity<?> getChampionMatches(
            @PathVariable String gameName,
            @PathVariable String tagLine,
            @PathVariable int championId,
            @RequestParam String region,
            @RequestParam(defaultValue = "20") int count) {

        log.info("Request for match history: {}#{} - Champion: {} ({} matches)",
                gameName, tagLine, championId, count);

        try {
            // First get the summoner to get their PUUID
            SummonerResponse summoner = summonerService.findOrCreateSummoner(gameName, tagLine, region);

            // Get match history for this champion
            MatchHistoryResponse matchHistory = matchService.getChampionMatchHistory(
                    summoner.getPuuid(),
                    region,
                    championId,
                    count
            );

            return ResponseEntity.ok(matchHistory);

        } catch (Exception e) {
            log.error("Error fetching match history: ", e);
            record ErrorResponse(String message) {}
            return ResponseEntity.internalServerError()
                    .body(new ErrorResponse("Failed to fetch match history"));
        }
    }

    record ErrorResponse(String message){}
}
