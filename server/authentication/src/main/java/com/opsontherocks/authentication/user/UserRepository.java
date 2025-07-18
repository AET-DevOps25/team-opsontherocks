package com.opsontherocks.authentication.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository interface for accessing user data.
 */
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
}
