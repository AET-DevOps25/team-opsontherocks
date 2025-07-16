package com.opsontherocks.authentication;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;


/*Creates users by registering them and provides HTTP-Only Cookies for Login*/

@OpenAPIDefinition(
    info = @Info(title = "Authentication API", version = "1.0", description = "API for user authentication and registration")
)
@SpringBootApplication
public class AuthenticationApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthenticationApplication.class, args);
    }

}
