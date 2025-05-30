package com.opsontherocks.wheel_of_life.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class WheelOfLifeController {
    private static final Logger log = LoggerFactory.getLogger(WheelOfLifeController.class);

    public static final String HEALTH_CHECK = "Wheel Of Life is up and running";

    private String getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            return authentication.getName();
        }
        return "anonymous";
    }

    /**
     * Public endpoint, accessible without authentication.
     */
    @GetMapping("/healthCheck")
    public ResponseEntity<String> helloPublic() {
        log.info("API CALL: /healthCheck accessed by user: {}", getAuthenticatedUser());
        return new ResponseEntity<>(HEALTH_CHECK, HttpStatus.OK);
    }
}