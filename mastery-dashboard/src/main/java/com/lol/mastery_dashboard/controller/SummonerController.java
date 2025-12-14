package com.lol.mastery_dashboard.controller;

import com.lol.mastery_dashboard.dto.response.SummonerResponse;
import com.lol.mastery_dashboard.service.SummonerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/summoners")
@RequiredArgsConstructor
@Slf4j

public class SummonerController {

    private final SummonerService summonerService;

    @GetMapping("/{gameName}/{tagLine}")
    public ResponseEntity<?> getSummoner(
            @PathVariable String gameName,
            @PathVariable String tagLine,
            @RequestParam String region) {

        log.info("Request received: {}#{} ({})", gameName, tagLine, region);

        try {
            SummonerResponse response = summonerService.findOrCreateSummoner(gameName, tagLine, region);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching summoner: ", e);

            record ErrorResponse(String message) {}
            return ResponseEntity.internalServerError()
                    .body(new ErrorResponse("Failed to fetch summoner data"));
        }
    }
}
