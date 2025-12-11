package com.lol.mastery_dashboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class MasteryDashboardApplication {

	public static void main(String[] args) {
		SpringApplication.run(MasteryDashboardApplication.class, args);
	}

}
