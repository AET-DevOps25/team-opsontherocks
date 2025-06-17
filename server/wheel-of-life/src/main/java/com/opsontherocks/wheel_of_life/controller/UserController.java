package com.opsontherocks.wheel_of_life.controller;

import com.opsontherocks.wheel_of_life.entity.Category;
import com.opsontherocks.wheel_of_life.entity.CategoryGroup;
import com.opsontherocks.wheel_of_life.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/users/me")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class UserController {

    private final JdbcTemplate jdbc;
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<String> currentUserName(@AuthenticationPrincipal String email) {
        String sql = "SELECT name FROM users WHERE email = ?";
        String name = jdbc.queryForObject(sql, new Object[]{email}, String.class);
        return ResponseEntity.ok(name);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> findAll(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(categoryService.getByUserEmail(email));
    }

    @PostMapping("/categories")
    public ResponseEntity<?> add(@RequestBody Category category,
                                 @AuthenticationPrincipal String email) {

        if (category == null || category.getName() == null || category.getName().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Category name must not be empty"));
        }

        if (category.getCategoryGroup() == null) {
            String allowed = Stream.of(CategoryGroup.values())
                    .map(Enum::name)
                    .collect(Collectors.joining(", "));
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Category group must be one of: " + allowed));
        }

        category.setUserEmail(email);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.add(category));
    }


    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> update(@PathVariable Long id,
                                           @RequestBody Category payload,
                                           @AuthenticationPrincipal String email) {
        return categoryService.findByIdAndUserEmail(id, email)
                .map(existing -> {
                    existing.setName(payload.getName());
                    return ResponseEntity.ok(categoryService.update(existing));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.FORBIDDEN).build());
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @AuthenticationPrincipal String email) {
        categoryService.deleteByIdAndUserEmail(id, email);
        return ResponseEntity.noContent().build();
    }
}
