package com.example.interior.service;

import com.example.interior.dto.request.ChangePasswordRequest;
import com.example.interior.dto.request.SigninRequest;
import com.example.interior.dto.request.SignupRequest;
import com.example.interior.dto.request.SocialSigninRequest;
import com.example.interior.dto.response.AuthResponse;
import com.example.interior.dto.response.FacebookUserResponse;
import com.example.interior.dto.response.GoogleUserResponse;
import com.example.interior.dto.response.MessageResponse;
import com.example.interior.enums.LoginType;
import com.example.interior.enums.Role;
import com.example.interior.repository.CartRepository;
import com.example.interior.repository.UserRepository;
import com.example.interior.security.JwtService;
import com.example.interior.service.support.UserResponseMapper;
import com.example.interior.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;
import com.example.interior.service.FacebookService;
@Service
public class AuthService {

	private final UserRepository userRepository;
	private final CartRepository cartRepository;
	private final JwtService jwtService;
	private final PasswordEncoder passwordEncoder;
	private final FacebookService facebookService;
	private final GoogleService googleService;

	public AuthService(
			UserRepository userRepository,
			CartRepository cartRepository,
			JwtService jwtService,
			PasswordEncoder passwordEncoder,
			FacebookService facebookService,
			GoogleService googleService) {

		this.userRepository = userRepository;
		this.cartRepository = cartRepository;
		this.jwtService = jwtService;
		this.passwordEncoder = passwordEncoder;
		this.facebookService = facebookService;
		this.googleService = googleService;
	}
	public AuthResponse signup(SignupRequest request) {
		if (userRepository.findByEmail(request.email()) != null) {
			throw new IllegalArgumentException("Email already exists");
		}
		User user = new User();
		user.setName(request.name());
		user.setEmail(request.email());
		user.setPassword(passwordEncoder.encode(request.password()));
		user.setRole(Role.USER);
		user.setType(LoginType.NORMAL);
		user.setIsVerified(false);
		user.setVerifyToken(UUID.randomUUID().toString());
		System.out.print(user.getVerifyToken());
		user = userRepository.save(user);
		createCartIfMissing(user);
		return new AuthResponse(jwtService.generateToken(user), UserResponseMapper.toPublic(user));
	}

	public AuthResponse signin(SigninRequest request) {
		User user = requireUserByEmail(request.email());
		if (!passwordEncoder.matches(request.password(), user.getPassword())) {
			throw new IllegalArgumentException("Sai tài khoản hoặc mật khẩu");
		}
		return new AuthResponse(jwtService.generateToken(user), UserResponseMapper.toPublic(user));
	}

	public AuthResponse signinByGoogle(String accessToken) {

		GoogleUserResponse googleUser = googleService.getUser(accessToken);

		if (googleUser == null
				|| googleUser.getEmail() == null
				|| !Boolean.TRUE.equals(googleUser.getEmail_verified())) {
			throw new IllegalArgumentException("Google token không hợp lệ");
		}

		User user = userRepository.findByEmail(googleUser.getEmail());

		if (user == null) {
			user = new User();
			user.setName(googleUser.getName());
			user.setEmail(googleUser.getEmail());
			user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
			user.setRole(Role.USER);
			user.setType(LoginType.GOOGLE);
			user.setIsVerified(true);
			user.setStatus(true);

			user = userRepository.save(user);
			createCartIfMissing(user);

		} else {

			user.setName(googleUser.getName());
			user.setType(LoginType.GOOGLE);
			user.setIsVerified(true);

			user = userRepository.save(user);
		}

		return new AuthResponse(
				jwtService.generateToken(user),
				UserResponseMapper.toPublic(user)
		);
	}
	public AuthResponse signinByFacebook(String accessToken) {

		FacebookUserResponse fbUser = facebookService.getUser(accessToken);

		if (fbUser == null || fbUser.getEmail() == null) {
			throw new IllegalArgumentException("Facebook token không hợp lệ");
		}

		User user = userRepository.findByEmail(fbUser.getEmail());

		if (user == null) {

			user = new User();
			user.setName(fbUser.getName());
			user.setEmail(fbUser.getEmail());
			user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
			user.setRole(Role.USER);
			user.setType(LoginType.FACEBOOK);
			user.setIsVerified(true);
			user.setStatus(true);

			user = userRepository.save(user);
			createCartIfMissing(user);

		} else {

			user.setName(fbUser.getName());
			user.setType(LoginType.FACEBOOK);
			user.setIsVerified(true);

			user = userRepository.save(user);
		}

		return new AuthResponse(
				jwtService.generateToken(user),
				UserResponseMapper.toPublic(user)
		);
	}

	public MessageResponse verifyEmail(String token) {
		User user = userRepository.findByVerifyToken(token);
		if (user == null) {
			throw new IllegalArgumentException("Invalid verification token");
		}
		user.setIsVerified(true);
		user.setVerifyToken(null);
		userRepository.save(user);
		return new MessageResponse("Email verified successfully");
	}

	public MessageResponse changePassword(User currentUser, ChangePasswordRequest request) {
		if (!passwordEncoder.matches(request.oldPassword(), currentUser.getPassword())) {
			throw new IllegalArgumentException("Old password is incorrect");
		}
		currentUser.setPassword(passwordEncoder.encode(request.newPassword()));
		userRepository.save(currentUser);
		return new MessageResponse("Password changed successfully");
	}

	public MessageResponse createResetToken(String email) {
		User user = requireUserByEmail(email);
		String token = UUID.randomUUID().toString();
		user.setVerifyToken(token);
		userRepository.save(user);
		return new MessageResponse(token);
	}

	public MessageResponse resetPassword(String token, String newPassword) {
		User user = userRepository.findByVerifyToken(token);
		if (user == null) {
			throw new IllegalArgumentException("Invalid reset token");
		}
		user.setPassword(passwordEncoder.encode(newPassword));
		user.setVerifyToken(null);
		userRepository.save(user);
		return new MessageResponse("Password reset successfully");
	}

	private User requireUserByEmail(String email) {
		User user = userRepository.findByEmail(email);
		if (user == null) {
			throw new IllegalArgumentException("User not found");
		}
		return user;
	}

	private void createCartIfMissing(User user) {
		if (cartRepository.findByUserId(user.getId()).isEmpty()) {
			var cart = new com.example.interior.entity.Cart();
			cart.setUser(user);
			cartRepository.save(cart);
		}
	}
}