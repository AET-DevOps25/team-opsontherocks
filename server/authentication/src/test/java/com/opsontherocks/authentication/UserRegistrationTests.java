package com.opsontherocks.authentication;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = Replace.ANY)
class UserRegistrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper mapper = new ObjectMapper();
    private static final String EMAIL = "test@example.com";
    private static final String PASSWORD = "secret";
    private static final String NAME = "John Doe";

    private static final User TEST_USER = new User(EMAIL, PASSWORD, NAME);

    @BeforeEach
    void setup() {
        userRepository.deleteAll();
    }

    @Test
    void whenRegister_thenUserIsPersisted() throws Exception {
        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson(EMAIL, PASSWORD, NAME)))
                .andExpect(status().isOk());

        assertThat(userRepository.count()).isEqualTo(1);
        assertThat(userRepository.findByEmail(EMAIL)).isPresent();
    }

    @Test
    void whenRegisterMultipleDifferentEmails_thenAllPersisted() throws Exception {
        int totalUsers = 10;

        for (int i = 1; i <= totalUsers; i++) {
            String mail = "user" + i + "@example.com";
            mockMvc.perform(post("/register")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(toJson(mail, PASSWORD, NAME)))
                    .andExpect(status().isOk());
        }

        assertThat(userRepository.count()).isEqualTo(totalUsers);
        assertThat(userRepository.findByEmail("user5@example.com")).isPresent();
        assertThat(userRepository.findByEmail("user20@example.com")).isNotPresent();
    }

    @Test
    void whenRegisterWithExistingEmail_thenBadRequest() throws Exception {
        userRepository.save(TEST_USER);

        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(toJson(EMAIL, "anotherPassword", NAME)))
                .andExpect(status().isBadRequest());

        assertThat(userRepository.count()).isEqualTo(1);
    }

    private String toJson(String mail, String password, String name ) throws JsonProcessingException {
        Map<String, String> dto = new HashMap<>();
        dto.put("email", mail);
        dto.put("password", password);
        dto.put("name", name);
        return mapper.writeValueAsString(dto);
    }
}
