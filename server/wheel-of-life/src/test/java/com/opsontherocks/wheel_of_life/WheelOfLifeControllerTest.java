package com.opsontherocks.wheel_of_life; // Match your test package structure

import com.opsontherocks.wheel_of_life.controller.WheelOfLifeController;
import com.opsontherocks.wheel_of_life.security.JwtUtil;
import com.opsontherocks.wheel_of_life.security.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = WheelOfLifeController.class)
@Import({SecurityConfig.class, WheelOfLifeControllerTest.JwtUtilTestConfig.class})
public class WheelOfLifeControllerTest {

    @TestConfiguration
    static class JwtUtilTestConfig {
        @Bean
        public JwtUtil jwtUtil() {
            return Mockito.mock(JwtUtil.class);
        }
    }

    @Autowired
    private MockMvc mockMvc;


    @Test
    void healthCheck_shouldBeAccessibleWithoutToken() throws Exception {
        mockMvc.perform(get("/healthCheck"))
                .andExpect(status().isOk())
                .andExpect(content().string(WheelOfLifeController.HEALTH_CHECK));
    }


    @Test
    void secured_whenNoToken_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/users/me"))
                .andExpect(status().isUnauthorized());
    }

}