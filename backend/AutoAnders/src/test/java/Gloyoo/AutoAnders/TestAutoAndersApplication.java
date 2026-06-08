package Gloyoo.AutoAnders;

import org.springframework.boot.SpringApplication;

public class TestAutoAndersApplication {

	public static void main(String[] args) {
		SpringApplication.from(AutoAndersApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
