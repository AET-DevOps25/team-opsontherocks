package com.opsontherocks.wheel_of_life;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    static final String HELLO_PUBLIC = "Hello From Public Route";
    static final String HELLO_SECURED = "Hello From Secured Route";

    /**
     * Public endpoint, accessible without authentication.
     */
    @GetMapping("/public")
    public ResponseEntity<String> helloPublic() {
        return new ResponseEntity<>(HELLO_PUBLIC, HttpStatus.OK);
    }

    /**
     * Secured endpoint, requires a valid JWT.
     */
    @GetMapping("/secured")
    public ResponseEntity<String> helloSecured() {
        return new ResponseEntity<>(HELLO_SECURED, HttpStatus.OK);
    }
}
