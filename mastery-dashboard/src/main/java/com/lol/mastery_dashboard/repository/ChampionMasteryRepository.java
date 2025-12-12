package com.lol.mastery_dashboard.repository;


import com.lol.mastery_dashboard.entity.ChampionMastery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChampionMasteryRepository extends JpaRepository<ChampionMastery, Long> {

    List<ChampionMastery> findBySummonerPuuid(String puuid);
    void deleteBySummonerPuuid(String puuid);
}
