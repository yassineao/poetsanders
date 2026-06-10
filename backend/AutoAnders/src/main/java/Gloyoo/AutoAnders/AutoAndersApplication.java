package Gloyoo.AutoAnders;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AutoAndersApplication {

	public static void main(String[] args) {
		SpringApplication.run(AutoAndersApplication.class, args);
	}

}
