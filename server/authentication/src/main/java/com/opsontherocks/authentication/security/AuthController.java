package com.opsontherocks.authentication.security;

import com.opsontherocks.authentication.user.User;
import com.opsontherocks.authentication.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Collections;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authManager;
    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;
    private final Environment env;

    private boolean isProd() {
        return Arrays.asList(env.getActiveProfiles()).contains("prod");
    }

    private ResponseCookie buildCookie(String token, long maxAgeSeconds) {
        ResponseCookie.ResponseCookieBuilder cb = ResponseCookie.from("JWT_TOKEN", token)
                .httpOnly(true)
                .path("/")
                .maxAge(maxAgeSeconds);

        if (isProd()) {
            cb.secure(true)
                    .sameSite("None");
        } else {
            cb.secure(false)
                    .sameSite("Lax");
        }
        return cb.build();
    }

    @GetMapping("/healthCheck")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Auth service running");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (!repo.existsById(req.getEmail())) {
            User u = User.builder()
                    .email(req.getEmail())
                    .password(encoder.encode(req.getPassword()))
                    .name(req.getName())
                    .build();
            repo.save(u);
        }

        String token = jwtUtil.generateToken(req.getEmail());
        ResponseCookie cookie = buildCookie(token, jwtUtil.getValiditySeconds());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Registration succeeded");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );
            String token = jwtUtil.generateToken(req.getEmail());
            ResponseCookie cookie = buildCookie(token, jwtUtil.getValiditySeconds());

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body("Login succeeded");
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401)
                    .body(Collections.singletonMap("error", "Invalid credentials"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        ResponseCookie cookie = buildCookie("", 0);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged out successfully");
    }
}
