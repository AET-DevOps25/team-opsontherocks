package com.opsontherocks.wheel_of_life;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final String clientOrigin =
            System.getenv().getOrDefault("CLIENT_ORIGIN", "http://localhost:5173");

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry
                .addMapping("/**")
                .allowedOrigins(clientOrigin)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                // allow the Authorization header (for sending JWTs)
                .allowedHeaders("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With")
                // expose it back to the client if you ever set tokens in the header
                .exposedHeaders("Authorization")
                .allowCredentials(true);
    }
}
