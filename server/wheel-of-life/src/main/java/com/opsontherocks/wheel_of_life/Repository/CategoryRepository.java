package com.opsontherocks.wheel_of_life.Repository;

import com.opsontherocks.wheel_of_life.Entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

}
