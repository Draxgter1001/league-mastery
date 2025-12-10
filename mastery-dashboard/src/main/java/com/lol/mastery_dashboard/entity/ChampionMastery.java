package com.lol.mastery_dashboard.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "champion_mastery")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChampionMastery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "puuid", nullable = false)
    private Summoner summoner;

    @Column(nullable = false)
    private Integer championId;

    @Column(nullable = false)
    private Integer championLevel;

    @Column(nullable = false)
    private Long championPoints;

    private Integer championPointsSinceLastLevel;
    private Integer championPointsUntilNextLevel;

    @Column(nullable = false)
    private Boolean chestGranted;
    private Integer tokensEarned;
    private Long lastPlayTime;

    public Boolean isChestAvailable(){
        return !chestGranted;
    }
}
