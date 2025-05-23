package com.opsontherocks.wheel_of_life;

import com.opsontherocks.wheel_of_life.user.User;
import com.opsontherocks.wheel_of_life.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                var users = List.of(
                        new User("alice@example.com", passwordEncoder.encode("alicePass"), "Alice Wonderland"),
                        new User("bob@example.com", passwordEncoder.encode("bobPass"), "Bob Builder"),
                        new User("charlie@example.com", passwordEncoder.encode("charliePass"), "Charlie Brown")
                );
                userRepository.saveAll(users);
                System.out.println("Initialized sample users: " + users);
            }
        };
    }
}
