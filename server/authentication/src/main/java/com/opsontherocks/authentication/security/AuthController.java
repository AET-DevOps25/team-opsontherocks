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

import java.net.URI;
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

    private ResponseCookie buildCookie(String token, long maxAgeSeconds, HttpServletRequest request) {
        String origin = request.getHeader("Origin");
        String domain = extractDomainFromOrigin(origin);

        ResponseCookie.ResponseCookieBuilder cb = ResponseCookie.from("JWT_TOKEN", token)
                .httpOnly(true)
                .path("/")
                .maxAge(maxAgeSeconds);

        if (origin != null && origin.contains("localhost")) {
            cb.secure(false).sameSite("Lax");
        } else {
            cb.secure(true).sameSite("None");
            if (domain != null && !domain.contains("localhost")) {
                cb.domain(domain); // required for cross-origin cookie
            }
        }

        return cb.build();
    }



    private String extractDomainFromOrigin(String origin) {
        try {
            URI uri = new URI(origin);
            return "." + uri.getHost(); // includes subdomain
        } catch (Exception e) {
            return null;
        }
    }

    @Operation(summary = "Health check for the authentication service")
    @GetMapping("/healthCheck")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Auth service running");
    }

    @Operation(summary = "Register a new user")
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req, HttpServletRequest request) {
        if (!repo.existsById(req.getEmail())) {
            User u = User.builder()
                    .email(req.getEmail())
                    .password(encoder.encode(req.getPassword()))
                    .name(req.getName())
                    .build();
            repo.save(u);
        }

        String token = jwtUtil.generateToken(req.getEmail());
        ResponseCookie cookie = buildCookie(token, jwtUtil.getValiditySeconds(), request);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Registration succeeded");
    }

    @Operation(summary = "Login a user")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletRequest request) {
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );
            String token = jwtUtil.generateToken(req.getEmail());
            ResponseCookie cookie = buildCookie(token, jwtUtil.getValiditySeconds(), request);

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
    public ResponseEntity<String> logout( HttpServletRequest request) {
        ResponseCookie cookie = buildCookie("", 0, request);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body("Logged out successfully");
    }
}
