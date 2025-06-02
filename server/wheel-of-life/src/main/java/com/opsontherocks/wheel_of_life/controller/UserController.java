package com.opsontherocks.wheel_of_life.controller;

import com.opsontherocks.wheel_of_life.entity.Category;

import com.opsontherocks.wheel_of_life.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class UserController {

    private final JdbcTemplate jdbc;
    private final CategoryService categoryService;

    @GetMapping("/users/me")
    public ResponseEntity<String> currentUserName(@AuthenticationPrincipal String email) {

        // This code is executed only if @PreAuthorize already passed (user is logged in)
        String sql = "SELECT name FROM users WHERE email = ?";
        String name = jdbc.queryForObject(sql, new Object[]{email}, String.class);
        return ResponseEntity.ok(name);
    }


    @GetMapping("/users/categories")
    public ResponseEntity<List<Category>> getUserCategories(@AuthenticationPrincipal String email) {
        List<Category> userCategories = categoryService.getByUserEmail(email);
        return ResponseEntity.ok(userCategories);
    }

}
//TODO: connect this user to their categories, hena fi get request w mafrud ye return the users categories -> connect with category service
