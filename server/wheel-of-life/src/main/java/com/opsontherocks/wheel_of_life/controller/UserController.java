package com.opsontherocks.wheel_of_life.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class UserController {

    private final JdbcTemplate jdbc;

    @GetMapping("/users/me")
    public ResponseEntity<String> currentUserName(@AuthenticationPrincipal String email) {

        // This code is executed only if @PreAuthorize already passed (user is logged in)
        String sql = "SELECT name FROM users WHERE email = ?";
        String name = jdbc.queryForObject(sql, new Object[]{email}, String.class);
        return ResponseEntity.ok(name);
    }
}
