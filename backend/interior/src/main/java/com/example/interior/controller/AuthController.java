package com.example.interior.controller;

import com.example.interior.dto.request.ChangePasswordRequest;
import com.example.interior.dto.request.ResetPasswordRequest;
import com.example.interior.dto.request.SigninRequest;
import com.example.interior.dto.request.SignupRequest;
import com.example.interior.dto.request.SocialSigninRequest;
import com.example.interior.dto.response.AuthResponse;
import com.example.interior.dto.response.MessageResponse;
import com.example.interior.entity.User;
import com.example.interior.enums.LoginType;
import com.example.interior.repository.UserRepository;
import com.example.interior.service.AuthService;
import com.example.interior.service.EmailService;
import com.example.interior.service.support.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/users"})
public class AuthController {

	private final AuthService authService;
	private final CurrentUserService currentUserService;
	private final EmailService emailService;
	private final UserRepository userRepository;

	public AuthController(AuthService authService, CurrentUserService currentUserService, EmailService emailService, UserRepository userRepository) {
		this.authService = authService;
		this.currentUserService = currentUserService;
		this.emailService = emailService;
		this.userRepository = userRepository;
	}

	@PostMapping("/signup")
	public AuthResponse signup(@Valid @RequestBody SignupRequest request) {
		return authService.signup(request);
	}

	@PostMapping("/signin")
	public AuthResponse signin(@Valid @RequestBody SigninRequest request) {
		return authService.signin(request);
	}

	@PostMapping("/signinByGoogle")
	public AuthResponse signinByGoogle(@Valid @RequestBody SocialSigninRequest request) {
		return authService.signinBySocial(request, LoginType.GOOGLE);
	}

	@PostMapping("/signinByFacebook")
	public AuthResponse signinByFacebook(@Valid @RequestBody SocialSigninRequest request) {
		return authService.signinBySocial(request, LoginType.FACEBOOK);
	}

	@GetMapping("/verify-email")
	public MessageResponse verifyEmail(@RequestParam String token) {
		return authService.verifyEmail(token);
	}

	@PutMapping("/change-password")
	public MessageResponse changePassword(Authentication authentication, @Valid @RequestBody ChangePasswordRequest request) {
		User currentUser = currentUserService.requireUser(authentication);
		return authService.changePassword(currentUser, request);
	}

	@PostMapping("/send")
	public MessageResponse sendResetToken(@RequestParam String email) {
		MessageResponse response = authService.createResetToken(email);
		emailService.sendSimpleMail(email, "Password reset token", "Your reset token: " + response.message());
		return new MessageResponse("Reset token sent");
	}

	@PostMapping("/reset-password/{token}")
	public MessageResponse resetPassword(@org.springframework.web.bind.annotation.PathVariable String token, @Valid @RequestBody ResetPasswordRequest request) {
		return authService.resetPassword(token, request.newPassword());
	}
}