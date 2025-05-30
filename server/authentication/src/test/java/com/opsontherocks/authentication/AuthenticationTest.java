// src/test/java/com/opsontherocks/authentication/AuthenticationControllerTest.java
package com.opsontherocks.authentication;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opsontherocks.authentication.security.JwtUtil;
import com.opsontherocks.authentication.security.LoginRequest;
import com.opsontherocks.authentication.security.RegisterRequest;
import com.opsontherocks.authentication.user.User;
import com.opsontherocks.authentication.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.ANY)
class AuthenticationTest {

    @Autowired
    MockMvc mockMvc;
    @Autowired
    UserRepository userRepository;
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    ObjectMapper mapper;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void clean() {
        userRepository.deleteAll();
    }

    @Test
    void registerShouldPersistUserAndReturnToken() throws Exception {
        var req = new RegisterRequest();
        req.setEmail("foo@bar.com");
        req.setPassword("secret");
        req.setName("Foo Bar");

        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                // now expecting JSON { "token": "…" }
                .andExpect(jsonPath("$.token").isNotEmpty());

        var opt = userRepository.findByEmail("foo@bar.com");
        assertThat(opt).isPresent();
        var u = opt.get();
        assertThat(jwtUtil.validateToken(mapper.readTree(
                        mockMvc.perform(post("/register")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(mapper.writeValueAsString(req)))
                                .andReturn().getResponse().getContentAsString())
                .get("token").asText())).isTrue();
    }

    @Test
    void loginShouldSetJwtCookieAndValidateToken() throws Exception {
        // seed a user
        var user = User.builder()
                .email("a@b.com")
                .password(passwordEncoder.encode("pw"))
                .name("AB")
                .build();
        userRepository.save(user);

        var login = new LoginRequest();
        login.setEmail("a@b.com");
        login.setPassword("pw");

        var mvcResult = mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(header().string("Set-Cookie", containsString("JWT_TOKEN=")))
                .andReturn();

        String cookie = mvcResult.getResponse().getHeader("Set-Cookie");
        String token = Arrays.stream(cookie.split(";")).map(String::trim)
                .filter(s -> s.startsWith("JWT_TOKEN="))
                .map(s -> s.substring("JWT_TOKEN=".length()))
                .findFirst().orElseThrow();

        assertThat(jwtUtil.validateToken(token)).isTrue();
        assertThat(jwtUtil.extractUsername(token)).isEqualTo("a@b.com");
    }

    @Test
    void logoutShouldClearJwtCookie() throws Exception {
        // first, login to get the cookie
        var user = User.builder()
                .email("x@y.com")
                .password(passwordEncoder.encode("pass"))
                .name("XY")
                .build();
        userRepository.save(user);

        var loginReq = new LoginRequest();
        loginReq.setEmail("x@y.com");
        loginReq.setPassword("pass");

        // perform login and capture cookie
        var loginResult = mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        String jwtCookie = loginResult.getResponse().getHeader("Set-Cookie");
        assertThat(jwtCookie).contains("JWT_TOKEN=");

        // now call logout with that cookie
        mockMvc.perform(post("/logout")
                        .header("Cookie", jwtCookie))
                .andExpect(status().isOk())
                .andExpect(header().string("Set-Cookie",
                        containsString("JWT_TOKEN=;")))
                .andExpect(header().string("Set-Cookie",
                        containsString("Max-Age=0")))
                .andExpect(header().string("Set-Cookie",
                        containsString("Path=/")));
    }
}
