package com.opsontherocks.wheel_of_life.service;

import com.opsontherocks.wheel_of_life.entity.Category;
import com.opsontherocks.wheel_of_life.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Category add(Category category) {
        return categoryRepository.save(category);
    }

    public void deleteById(Long id){
        categoryRepository.deleteById(id);
    }

    public List<Category> getByUserEmail(String email) {
        return categoryRepository.findByUserEmail(email);
    }

    public Optional<Category> findByIdAndUserEmail(Long id, String email) {
        return categoryRepository.findByIdAndUserEmail(id, email);
    }

    public Category update(Category toUpdate) {
        return categoryRepository.save(toUpdate);
    }
}
