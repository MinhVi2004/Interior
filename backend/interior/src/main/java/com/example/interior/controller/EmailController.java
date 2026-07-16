package com.example.interior.controller;

import com.example.interior.dto.request.EmailRequest;
import com.example.interior.dto.response.MessageResponse;
import com.example.interior.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/email")
public class EmailController {

	private final EmailService emailService;

	public EmailController(EmailService emailService) {
		this.emailService = emailService;
	}

	@PostMapping
	public MessageResponse send(@Valid @RequestBody EmailRequest request) {
		emailService.sendContactMail(request.name(), request.email(), request.message());
		return new MessageResponse("Email sent");
	}
}