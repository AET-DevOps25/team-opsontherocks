package com.opsontherocks.wheel_of_life.security; // Recommended sub-package

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String jwt = null;
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
        } else if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("JWT_TOKEN".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        String username = null;
        List<GrantedAuthority> authorities = null;

        if (jwt != null) {
            try {
                if (jwtUtil.validateToken(jwt)) {
                    username = jwtUtil.extractUsername(jwt);
                    authorities = jwtUtil.extractAuthorities(jwt);
                }
            } catch (ExpiredJwtException e) {
                logger.warn("JWT token is expired: {}", e.getMessage());
            } catch (UnsupportedJwtException e) {
                logger.warn("JWT token is unsupported: {}", e.getMessage());
            } catch (MalformedJwtException e) {
                logger.warn("Invalid JWT token: {}", e.getMessage());
            } catch (SignatureException e) {
                logger.warn("Invalid JWT signature: {}", e.getMessage());
            } catch (IllegalArgumentException e) {
                logger.warn("JWT claims string is empty or invalid: {}", e.getMessage());
            } catch (Exception e) {
                logger.error("Unexpected error during JWT processing: {}", e.getMessage(), e);
            }
        }

        if (username != null && authorities != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    username, null, authorities);
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }
}