package com.example.interior.repository;

import com.example.interior.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

	User findByEmail(String email);

	User findByVerifyToken(String verifyToken);
}