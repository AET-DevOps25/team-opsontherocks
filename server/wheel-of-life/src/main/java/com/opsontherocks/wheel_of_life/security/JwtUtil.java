package com.opsontherocks.wheel_of_life.security; // Adjust package if needed

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

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


    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    @SuppressWarnings("unchecked")
    public List<GrantedAuthority> extractAuthorities(String token) {
        final Claims claims = extractAllClaims(token);
        List<Map<String, String>> authoritiesMaps = claims.get("authorities", List.class);
        if (authoritiesMaps == null) {
            // If no authorities are found, return a default ROLE_USER authority
            return List.of(new SimpleGrantedAuthority("ROLE_USER"));
        }
        return authoritiesMaps.stream()
                .map(map -> new SimpleGrantedAuthority(map.get("authority")))
                .collect(Collectors.toList());
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            System.err.println("JWT Validation error: " + e.getMessage());
            return false;
        }
    }
}