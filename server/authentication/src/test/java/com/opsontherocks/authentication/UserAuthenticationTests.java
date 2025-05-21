package com.opsontherocks.authentication;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.formLogin;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.response.SecurityMockMvcResultMatchers.authenticated;
import static org.springframework.security.test.web.servlet.response.SecurityMockMvcResultMatchers.unauthenticated;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = Replace.ANY)
class UserAuthenticationTests {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String EMAIL = "test@example.com";
    private static final String RAW_PASSWORD = "secret";
    private static final String NAME = "John Doe";

    private User testUser;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        testUser = new User(
                EMAIL,
                passwordEncoder.encode(RAW_PASSWORD),
                NAME
        );
    }

    @Test
    void whenLoginWithValidCredentials_thenRedirectToHomeAndAuthenticated() throws Exception {
        userRepository.save(testUser);

        mockMvc.perform(formLogin()
                        .user(EMAIL)
                        .password(RAW_PASSWORD))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/"))
                .andExpect(authenticated());
    }

    @Test
    void whenLoginWithInvalidPassword_thenRedirectToLoginWithErrorAndUnauthenticated() throws Exception {
        userRepository.save(testUser);

        mockMvc.perform(formLogin()
                        .user(EMAIL)
                        .password("wrongpass"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login?error"))
                .andExpect(unauthenticated());
    }

    @Test
    void whenLoginWithUnknownUser_thenRedirectToLoginWithErrorAndUnauthenticated() throws Exception {
        mockMvc.perform(formLogin()
                        .user("noone@example.com")
                        .password("nopass"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login?error"))
                .andExpect(unauthenticated());
    }

    @Test
    void securedEndpointRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/profile"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrlPattern("**/login"));
    }


    @Test
    void whenLogout_thenRedirectToLoginWithLogoutParamAndSessionInvalidated() throws Exception {
        userRepository.save(testUser);

        mockMvc.perform(formLogin()
                        .user(EMAIL)
                        .password(RAW_PASSWORD))
                .andExpect(authenticated());

        mockMvc.perform(post("/logout").with(csrf()))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login?logout"))
                .andExpect(unauthenticated());

        mockMvc.perform(get("/profile"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrlPattern("**/login"));
    }
}
