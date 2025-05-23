package com.opsontherocks.wheel_of_life;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opsontherocks.wheel_of_life.security.JwtUtil;
import com.opsontherocks.wheel_of_life.security.LoginRequest;
import com.opsontherocks.wheel_of_life.security.RegisterRequest;
import com.opsontherocks.wheel_of_life.user.User;
import com.opsontherocks.wheel_of_life.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@AutoConfigureTestDatabase(replace = Replace.ANY)
public class AuthenticationTest {

    private static final String REGISTER_URL = "/auth/register";
    private static final String LOGIN_URL = "/auth/login";
    private static final String PUBLIC_URL = "/public";
    private static final String SECURED_URL = "/secured";

    private static final String TEST_EMAIL = "test@example.com";
    private static final String TEST_PASSWORD = "password123";
    private static final String TEST_NAME = "Test User";

    private static final String LOGIN_EMAIL = "login@example.com";
    private static final String LOGIN_PASSWORD = "pass123";
    private static final String LOGIN_NAME = "Login User";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void testPublicRoute() throws Exception {
        mockMvc.perform(get(PUBLIC_URL))
                .andExpect(status().isOk())
                .andExpect(content().string(HelloController.HELLO_PUBLIC));
    }

    @Test
    void testRegisterAndLookup() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail(TEST_EMAIL);
        registerRequest.setPassword(TEST_PASSWORD);
        registerRequest.setName(TEST_NAME);

        mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());

        Optional<User> optionalUser = userRepository.findByEmail(TEST_EMAIL);
        assertThat(optionalUser)
                .as("User should be saved in the repository")
                .isPresent();

        User savedUser = optionalUser.get();
        assertThat(savedUser.getName())
                .as("User name should match")
                .isEqualTo(TEST_NAME);
        assertThat(passwordEncoder.matches(TEST_PASSWORD, savedUser.getPassword()))
                .as("Password should be encoded and match the raw password")
                .isTrue();
    }

    @Test
    void testLogin() throws Exception {
        User user = User.builder()
                .email(LOGIN_EMAIL)
                .name(LOGIN_NAME)
                .password(passwordEncoder.encode(LOGIN_PASSWORD))
                .build();
        userRepository.save(user);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(LOGIN_EMAIL);
        loginRequest.setPassword(LOGIN_PASSWORD);

        var result = mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andReturn();

        String token = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("token").asText();
        assertThat(jwtUtil.validateToken(token))
                .as("JWT should be valid")
                .isTrue();
        assertThat(jwtUtil.extractUsername(token))
                .as("Token subject should match the email")
                .isEqualTo(LOGIN_EMAIL);
    }

    @Test
    void testAccessSecuredRoute() throws Exception {
        mockMvc.perform(get(SECURED_URL))
                .andExpect(status().isForbidden());

        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail(TEST_EMAIL);
        registerRequest.setPassword(TEST_PASSWORD);
        registerRequest.setName(TEST_NAME);

        var regResult = mockMvc.perform(post(REGISTER_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andReturn();

        String token = objectMapper.readTree(regResult.getResponse().getContentAsString())
                .get("token").asText();

        mockMvc.perform(get(SECURED_URL)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().string(HelloController.HELLO_SECURED));
    }

}
