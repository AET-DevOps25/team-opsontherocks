package com.opsontherocks.wheel_of_life.service;

import com.opsontherocks.wheel_of_life.entity.Category;
import com.opsontherocks.wheel_of_life.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    public Category add(Category category){
        return categoryRepository.save(category);
    }
    public void delete(Long id){
        categoryRepository.deleteById(id);
    }
}
