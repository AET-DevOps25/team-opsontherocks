package com.opsontherocks.wheel_of_life;

import com.opsontherocks.wheel_of_life.entity.Category;
import com.opsontherocks.wheel_of_life.entity.CategoryGroup;
import com.opsontherocks.wheel_of_life.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {


    @Bean
    CommandLineRunner initCategories(CategoryRepository categoryRepository) {
        return args -> {
            if (categoryRepository.count() == 0) {
                var categories = List.of(
                        new Category("Career Growth", CategoryGroup.Career, "alice@example.com"),
                        new Category("Mental Health", CategoryGroup.Health, "alice@example.com"),
                        new Category("Friends", CategoryGroup.Relationships, "alice@example.com")
                );
                categoryRepository.saveAll(categories);
                System.out.println("Initialized sample categories: " + categories);
                categoryRepository.deleteById(categories.get(0).getId());
            }
        };
    }

}
