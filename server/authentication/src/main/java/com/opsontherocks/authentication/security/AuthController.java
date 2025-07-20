package com.opsontherocks.authentication.security;

import com.opsontherocks.authentication.user.User;
import com.opsontherocks.authentication.user.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
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

@Tag(name = "Authentication", description = "Endpoints for user authentication and registration")
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

    private boolean isRancher() {
        String isRancher = env.getProperty("IS_RANCHER");
        return isRancher != null && isRancher.equalsIgnoreCase("true");
    }

    private ResponseCookie buildCookie(String token, long maxAgeSeconds) {
        ResponseCookie.ResponseCookieBuilder cb = ResponseCookie.from("JWT_TOKEN", token)
                .httpOnly(true)
                .path("/")
                .maxAge(maxAgeSeconds);

        if (isRancher()) {
            cb.secure(true)
              .sameSite("None")
              .domain(".opsontherocks.student.k8s.aet.cit.tum.de");
        } else if (isProd()) {
            cb.secure(true)
              .sameSite("None")
              .domain(".54.166.45.176.nip.io");
        } else {
            cb.secure(false)
              .sameSite("Lax");
            // No domain for local/dev
        }
        return cb.build();
    }

    @Operation(summary = "Health check for the authentication service")
    @GetMapping("/healthCheck")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Auth service running");
    }

    @Operation(summary = "Register a new user")
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

    @Operation(summary = "Login a user")
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

    @Operation(summary = "Logout the current user")
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        ResponseCookie cookie = buildCookie("", 0);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged out successfully");
    }
}
