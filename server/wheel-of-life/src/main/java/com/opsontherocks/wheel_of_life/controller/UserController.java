package com.opsontherocks.wheel_of_life.controller;

import com.opsontherocks.wheel_of_life.entity.Category;
import com.opsontherocks.wheel_of_life.entity.CategoryGroup;
import com.opsontherocks.wheel_of_life.entity.ChatMessage;
import com.opsontherocks.wheel_of_life.entity.Report;
import com.opsontherocks.wheel_of_life.service.CategoryService;
import com.opsontherocks.wheel_of_life.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.HashMap;
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
    private final ReportService reportService;

    // --- User Info ---
    @GetMapping
    public ResponseEntity<String> currentUserName(@AuthenticationPrincipal String email) {
        String sql = "SELECT name FROM users WHERE email = ?";
        String name = jdbc.queryForObject(sql, new Object[]{email}, String.class);
        return ResponseEntity.ok(name);
    }

    // --- Categories ---
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
        categoryService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/categories/defaults")
    public ResponseEntity<?> createDefaultCategories(@AuthenticationPrincipal String email) {
        List<Category> existingCategories = categoryService.getByUserEmail(email);
        if (existingCategories.isEmpty()) {
            List<Category> defaultCategories = List.of(
                    new Category("Finances", CategoryGroup.Career, email),
                    new Category("Mental Health", CategoryGroup.Health, email),
                    new Category("Physical Health", CategoryGroup.Health, email),
                    new Category("Friends", CategoryGroup.Relationships, email),
                    new Category("Family", CategoryGroup.Relationships, email),
                    new Category("Romance", CategoryGroup.Relationships, email),
                    new Category("Growth", CategoryGroup.Career, email),
                    new Category("Purpose", CategoryGroup.Career, email),
                    new Category("Social Engagement", CategoryGroup.Other, email),
                    new Category("Entertainment", CategoryGroup.Other, email)
            );
            for (Category category : defaultCategories) {
                categoryService.add(category);
            }
            return ResponseEntity.status(HttpStatus.CREATED).build();
        }
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    // --- Reports ---
    @GetMapping("/reports")
    public ResponseEntity<List<Report>> getAllReports(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(reportService.getByUserEmail(email));
    }

    @GetMapping("/reports/{year}/{week}")
    public ResponseEntity<?> getReport(@PathVariable int year,
                                       @PathVariable int week,
                                       @AuthenticationPrincipal String email) {
        return reportService.getByWeekAndYear(email, week, year)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/reports")
    public ResponseEntity<?> addOrUpdateReport(@RequestBody Report report,
                                               @AuthenticationPrincipal String email) {
        if (report.getCalendarWeek() == null || report.getYear() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Week and year are required."));
        }

        report.setUserEmail(email);
        Report saved = reportService.addOrUpdate(report);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/reports/{year}/{week}")
    public ResponseEntity<Void> deleteReport(@PathVariable int year,
                                             @PathVariable int week,
                                             @AuthenticationPrincipal String email) {
        reportService.delete(email, week, year);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/reports/this-week")
    public ResponseEntity<?> createEmptyReportForThisWeek(@AuthenticationPrincipal String email) {
        int week = LocalDate.now().get(WeekFields.ISO.weekOfWeekBasedYear());
        int year = LocalDate.now().get(WeekFields.ISO.weekBasedYear());

        if (reportService.getByWeekAndYear(email, week, year).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Report already exists for this week"));
        }

        Report newReport = new Report(week, year, email);
        newReport.setScores(new HashMap<>());
        newReport.setNotes("");
        newReport.setChat(List.of(
                new ChatMessage("Let's reflect on your week. How did it go?", ChatMessage.Sender.AI)
        ));

        return ResponseEntity.status(HttpStatus.CREATED).body(reportService.addOrUpdate(newReport));
    }
}
