package com.example.interior.service.support;

import com.example.interior.entity.User;
import com.example.interior.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

	private final UserRepository userRepository;

	public CurrentUserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public User requireUser(Authentication authentication) {
		if (authentication == null || authentication.getName() == null) {
			throw new IllegalStateException("Unauthenticated request");
		}
		User user = userRepository.findByEmail(authentication.getName());
		if (user == null) {
			throw new IllegalStateException("User not found: " + authentication.getName());
		}
		return user;
	}
}