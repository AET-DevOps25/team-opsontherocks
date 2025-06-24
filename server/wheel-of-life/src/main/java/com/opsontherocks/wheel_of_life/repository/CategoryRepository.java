package com.opsontherocks.wheel_of_life.repository;

import com.opsontherocks.wheel_of_life.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserEmail(String email);

    void deleteById(Long id);

    Optional<Category> findByIdAndUserEmail(Long id, String email);
}
