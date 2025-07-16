package com.opsontherocks.wheel_of_life;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@OpenAPIDefinition(
    info = @Info(title = "Wheel of Life API", version = "1.0", description = "API for Wheel of Life endpoints")
)
@SpringBootApplication
public class WheelOfLifeApplication {

	public static void main(String[] args) {
		SpringApplication.run(WheelOfLifeApplication.class, args);
	}

}
