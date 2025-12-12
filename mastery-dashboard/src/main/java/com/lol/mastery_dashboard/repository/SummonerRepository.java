package com.lol.mastery_dashboard.repository;


import com.lol.mastery_dashboard.entity.Summoner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SummonerRepository extends JpaRepository<Summoner, String> {

    Optional<Summoner> findByGameNameAndTagLineAndRegion(
            String gameName,
            String tagLine,
            String region
    );
}
