package com.opsontherocks.wheel_of_life;

import com.opsontherocks.wheel_of_life.entity.Category;
import com.opsontherocks.wheel_of_life.entity.CategoryGroup;
import com.opsontherocks.wheel_of_life.entity.ChatMessage;
import com.opsontherocks.wheel_of_life.entity.Report;
import com.opsontherocks.wheel_of_life.repository.CategoryRepository;
import com.opsontherocks.wheel_of_life.repository.ReportRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initMockData(CategoryRepository categoryRepository, ReportRepository reportRepository) {
        return args -> {
            List<String> users = List.of("alice@example.com", "bob@example.com", "charlie@example.com");

            for (String userEmail : users) {
                createDefaultCategoriesForUser(categoryRepository, userEmail);

                if (userEmail.equals("alice@example.com")) {
                    for (int week = 1; week <= 3; week++) {
                        createMockReportForUser(reportRepository, userEmail, week);
                    }
                } else {
                    createMockReportForUser(reportRepository, userEmail, 1);
                }
            }
        };
    }

    private void createDefaultCategoriesForUser(CategoryRepository categoryRepository, String userEmail) {
        List<Category> existingCategories = categoryRepository.findAll().stream()
                .filter(cat -> cat.getUserEmail().equals(userEmail))
                .toList();

        if (existingCategories.isEmpty()) {
            List<Category> defaultCategories = List.of(
                    new Category("Finances", CategoryGroup.Career, userEmail),
                    new Category("Mental Health", CategoryGroup.Health, userEmail),
                    new Category("Physical Health", CategoryGroup.Health, userEmail),
                    new Category("Friends", CategoryGroup.Relationships, userEmail),
                    new Category("Family", CategoryGroup.Relationships, userEmail),
                    new Category("Romance", CategoryGroup.Relationships, userEmail),
                    new Category("Growth", CategoryGroup.Career, userEmail),
                    new Category("Purpose", CategoryGroup.Career, userEmail),
                    new Category("Social Engagement", CategoryGroup.Other, userEmail),
                    new Category("Entertainment", CategoryGroup.Other, userEmail)
            );
            categoryRepository.saveAll(defaultCategories);
            System.out.println("Created default categories for user: " + userEmail);
        }
    }

    private void createMockReportForUser(ReportRepository reportRepository, String userEmail, int week) {
        if (reportRepository.findByCalendarWeekAndYearAndUserEmail(week, 2025, userEmail).isEmpty()) {
            Map<String, Float> scores = createMockScores(userEmail, week);
            List<ChatMessage> chat = createMockChat(userEmail, week);

            Report report = new Report(week, 2025, userEmail);
            report.setScores(scores);
            report.setNotes(createMockNotes(userEmail, week));
            report.setChat(chat);

            reportRepository.save(report);
            System.out.printf("Created mock report for week %d, 2025 for user: %s%n", week, userEmail);
        }
    }

    private Map<String, Float> createMockScores(String userEmail, int week) {
        Map<String, Float> scores = new HashMap<>();
        float modifier = week * 0.2f;

        switch (userEmail) {
            case "alice@example.com":
                scores.put("Finances", 7.0f + modifier);
                scores.put("Mental Health", 7.5f + modifier);
                scores.put("Physical Health", 6.0f + modifier);
                scores.put("Friends", 8.5f + modifier);
                scores.put("Family", 8.0f + modifier);
                scores.put("Romance", 6.5f + modifier);
                scores.put("Growth", 8.0f + modifier);
                scores.put("Purpose", 7.0f + modifier);
                scores.put("Social Engagement", 7.5f + modifier);
                scores.put("Entertainment", 6.5f + modifier);
                break;
            case "bob@example.com":
                scores.put("Finances", 6.0f);
                scores.put("Mental Health", 7.5f);
                scores.put("Physical Health", 8.5f);
                scores.put("Friends", 6.5f);
                scores.put("Family", 9.0f);
                scores.put("Romance", 8.0f);
                scores.put("Growth", 6.5f);
                scores.put("Purpose", 7.0f);
                scores.put("Social Engagement", 6.0f);
                scores.put("Entertainment", 8.5f);
                break;
            case "charlie@example.com":
                scores.put("Finances", 8.0f);
                scores.put("Mental Health", 6.5f);
                scores.put("Physical Health", 7.0f);
                scores.put("Friends", 7.5f);
                scores.put("Family", 6.0f);
                scores.put("Romance", 5.5f);
                scores.put("Growth", 9.0f);
                scores.put("Purpose", 8.5f);
                scores.put("Social Engagement", 7.0f);
                scores.put("Entertainment", 6.5f);
                break;
        }

        return scores;
    }

    private List<ChatMessage> createMockChat(String userEmail, int week) {
        if (!userEmail.equals("alice@example.com")) return createMockChat(userEmail);

        return List.of(
                new ChatMessage("Welcome to week " + week + " of 2025! How are things going so far?", ChatMessage.Sender.AI),
                new ChatMessage("Week " + week + " has had its ups and downs, but I’m staying focused.", ChatMessage.Sender.USER),
                new ChatMessage("Glad to hear that! What's your main priority this week?", ChatMessage.Sender.AI),
                new ChatMessage("Trying to maintain a consistent workout routine.", ChatMessage.Sender.USER),
                new ChatMessage("That’s a great goal. Keep pushing forward!", ChatMessage.Sender.AI)
        );
    }

    private List<ChatMessage> createMockChat(String userEmail) {
        return List.of(
                new ChatMessage("Welcome to your first week of 2025! How are you feeling about the new year so far?", ChatMessage.Sender.AI),
                new ChatMessage("I'm feeling optimistic about the fresh start. Made some good progress on my goals already.", ChatMessage.Sender.USER),
                new ChatMessage("That's wonderful! I can see from your scores that you're doing well in several areas. What would you like to focus on improving this week?", ChatMessage.Sender.AI),
                new ChatMessage("I think I could work on my physical health a bit more. Been a bit sedentary lately.", ChatMessage.Sender.USER),
                new ChatMessage("Great self-awareness! Maybe try adding a short walk to your daily routine. Small steps lead to big changes!", ChatMessage.Sender.AI)
        );
    }

    private String createMockNotes(String userEmail, int week) {
        if (!userEmail.equals("alice@example.com")) return createMockNotes(userEmail);

        return "Week " + week + ": Continuing strong. Physical activity is improving, and relationships are thriving. Hoping to keep up the momentum next week!";
    }

    private String createMockNotes(String userEmail) {
        switch (userEmail) {
            case "bob@example.com":
                return "Solid first week of the year. Family time was amazing, and I'm feeling physically strong. However, I've been neglecting my social life a bit and need to reconnect with friends. Also, should probably review my financial goals for the year.";
            case "charlie@example.com":
                return "Interesting week - lots of personal growth and learning happening. Career-wise feeling very fulfilled and purposeful. However, my personal relationships need attention, especially family connections. Mental health has been a bit challenging with the winter blues.";
            default:
                return "Reflecting on the first week of 2025. Overall feeling positive about the year ahead.";
        }
    }
}
