package com.opsontherocks.authentication.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;
    
    private Key key;

    @PostConstruct
    public void init() {
        if (secret == null || secret.length() < 64) {
            throw new IllegalStateException("JWT_SECRET missing or too short (needs ≥64 chars)");
        }
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        System.out.println("JWT secret length = " + secret.length());
    }


    private final long validity = 1000 * 60 * 60 * 24; // 24 h

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + validity))
                .signWith(key)
                .compact();
    }

    public String extractUsername(String token) {
        return parse(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jws<Claims> claims = parse(token);
            return !claims.getBody().getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Jws<Claims> parse(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }

    public long getValiditySeconds() {
        return validity / 1000;
    }
}
