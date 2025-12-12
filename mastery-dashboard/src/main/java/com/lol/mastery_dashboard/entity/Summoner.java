package com.lol.mastery_dashboard.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="summoners")
@Data //Lombok Package: Generates getters, setters, toString, equals and hasCode methods
@NoArgsConstructor
@AllArgsConstructor
public class Summoner {

    @Id
    @Column(nullable = false, unique = true)
    private String puuid; //Riot's universal unique identifier

    @Column(nullable = false)
    private String gameName;

    @Column(nullable = false)
    private String tagLine;

    @Column(nullable = false)
    private String region;

    private Integer profileIconId;
    private Long summonerLevel;

    @Column(nullable = false)
    private LocalDateTime lastUpdated;

    @OneToMany(mappedBy = "summoner", cascade = CascadeType.ALL)
    private List<ChampionMastery> championMasteries = new ArrayList<>();

    @PrePersist
    @PreUpdate
    protected void onUpdate(){
        this.lastUpdated = LocalDateTime.now();
    }
}
