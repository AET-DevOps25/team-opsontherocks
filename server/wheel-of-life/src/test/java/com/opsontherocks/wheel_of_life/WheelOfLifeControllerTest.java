package com.opsontherocks.wheel_of_life; // Match your test package structure

import com.opsontherocks.wheel_of_life.controller.WheelOfLifeController;
import com.opsontherocks.wheel_of_life.entity.Category;
import com.opsontherocks.wheel_of_life.entity.CategoryGroup;
import com.opsontherocks.wheel_of_life.repository.CategoryRepository;
import com.opsontherocks.wheel_of_life.security.JwtUtil;
import com.opsontherocks.wheel_of_life.security.SecurityConfig;
import com.opsontherocks.wheel_of_life.service.CategoryService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.junit.jupiter.api.BeforeEach;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = WheelOfLifeController.class)
@Import({SecurityConfig.class, WheelOfLifeControllerTest.JwtUtilTestConfig.class})
@ExtendWith(MockitoExtension.class)
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


    @Mock
    private CategoryRepository  categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void testGetByUserEmail(){ //returns user categories
        String userEmail = "test@example.com";
        List<Category> mockCategories =  List.of(
                new Category("Fitness", CategoryGroup.Health, userEmail),
                new Category("Career Planning", CategoryGroup.Career, userEmail)
        );
        when(categoryRepository.findByUserEmail(userEmail)).thenReturn(mockCategories);

        List<Category> result = categoryService.getByUserEmail(userEmail);

        assertEquals(2, result.size());
        assertEquals("Fitness", result.get(0).getName());
        verify(categoryRepository).findByUserEmail(userEmail);
    }

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAll() {
        List<Category> mockList = List.of(new Category(), new Category());
        when(categoryRepository.findAll()).thenReturn(mockList);

        List<Category> result = categoryService.getAll();

        assertEquals(2, result.size());
        verify(categoryRepository, times(1)).findAll();
    }

    @Test
    void testAddCategory() {
        Category category = new Category();
        when(categoryRepository.save(category)).thenReturn(category);

        Category result = categoryService.add(category);

        assertNotNull(result);
        verify(categoryRepository).save(category);
    }

    @Test
    void testDeleteByUserEmail() {
        Long id = 1L;
        String email = "test@example.com";

        categoryService.deleteById(id);

        verify(categoryRepository).deleteById(id);
    }


    @Test
    void testFindByIdAndUserEmail() {
        Long id = 1L;
        String email = "test@example.com";
        Optional<Category> expected = Optional.of(new Category());
        when(categoryRepository.findByIdAndUserEmail(id, email)).thenReturn(expected);

        Optional<Category> result = categoryService.findByIdAndUserEmail(id, email);

        assertTrue(result.isPresent());
        verify(categoryRepository).findByIdAndUserEmail(id, email);
    }

    @Test
    void testUpdateCategory() {
        Category category = new Category();
        when(categoryRepository.save(category)).thenReturn(category);

        Category result = categoryService.update(category);

        assertNotNull(result);
        verify(categoryRepository).save(category);
    }




}