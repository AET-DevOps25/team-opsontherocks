package com.opsontherocks.authentication;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public AuthController(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDto dto) {
        if (repo.findByEmail(dto.email()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }
        var user = new User(dto.email(), encoder.encode(dto.password()), dto.name);
        repo.save(user);
        return ResponseEntity.ok("OK");
    }

    record RegisterDto(String email, String password, String name) {
    }
}
