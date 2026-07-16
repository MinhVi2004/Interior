package com.example.interior.controller;

import com.example.interior.dto.response.MessageResponse;
import com.example.interior.dto.response.PublicUserResponse;
import com.example.interior.entity.User;
import com.example.interior.enums.Role;
import com.example.interior.repository.UserRepository;
import com.example.interior.service.support.UserResponseMapper;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserRepository userRepository;

	public UserController(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public List<PublicUserResponse> findAll() {
		return userRepository.findAll().stream().map(UserResponseMapper::toPublic).toList();
	}

	@GetMapping("/{id}")
	public PublicUserResponse findById(@PathVariable Long id) {
		User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
		return UserResponseMapper.toPublic(user);
	}

	@PutMapping("/{id}/promote")
	@PreAuthorize("hasRole('ADMIN')")
	@Transactional
	public PublicUserResponse promote(@PathVariable Long id) {
		User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
		user.setRole(Role.ADMIN);
		return UserResponseMapper.toPublic(userRepository.save(user));
	}

	@PutMapping("/{id}/block")
	@PreAuthorize("hasRole('ADMIN')")
	@Transactional
	public PublicUserResponse block(@PathVariable Long id) {
		User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
		user.setStatus(false);
		return UserResponseMapper.toPublic(userRepository.save(user));
	}
}