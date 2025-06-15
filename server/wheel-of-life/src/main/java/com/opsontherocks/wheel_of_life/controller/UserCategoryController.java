package com.opsontherocks.wheel_of_life.controller;

import com.opsontherocks.wheel_of_life.entity.Category;

import com.opsontherocks.wheel_of_life.security.JwtUtil;
import com.opsontherocks.wheel_of_life.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class UserCategoryController {

    private final JdbcTemplate jdbc;
    private final CategoryService categoryService;
    private final JwtUtil jwtUtil;



    @GetMapping("/users/me-category")
    public ResponseEntity<String> currentUserName(@AuthenticationPrincipal Long id) {

        // This code is executed only if @PreAuthorize already passed (user is logged in)
        String sql = "SELECT name FROM users WHERE email= ?"; //TODO change to id, prio 2
        String name = jdbc.queryForObject(sql, new Object[]{id}, String.class);
        return ResponseEntity.ok(name);
    }


    @GetMapping("/users/category-list")
    public ResponseEntity<List<Category>> getUserCategories(@AuthenticationPrincipal String email) {
        List<Category> userCategories = categoryService.getByUserEmail(email);
        return ResponseEntity.ok(userCategories);
    }

    @PostMapping
    public ResponseEntity<Category> add(@RequestBody Category category, @AuthenticationPrincipal String email) {
        if (category.getName() == null || category.getName().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        category.setUserEmail(email);
        return ResponseEntity.ok(categoryService.add(category));
    }

    @PutMapping
    public ResponseEntity<Category> updateCategory(@RequestBody Category category,
                                                   @AuthenticationPrincipal String email) {
        if (category == null || email == null) {
            return ResponseEntity.badRequest().build();
        }

        // Ensure the category belongs to the authenticated user
        Optional<Category> existing = categoryService.findByIdAndUserEmail(category.getId(), email);
        if (existing.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Only update the name; keep other details
        Category toUpdate = existing.get();
        toUpdate.setName(category.getName());

        Category updated = categoryService.update(toUpdate);
        return ResponseEntity.ok(updated);
    }


    @DeleteMapping("/{categoryId}")
    public void delete(@PathVariable Long categoryId,
                       @AuthenticationPrincipal String email) {
        categoryService.deleteByUserEmail(categoryId, email);
    }

}
