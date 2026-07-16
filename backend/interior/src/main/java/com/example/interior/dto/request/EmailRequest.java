package com.example.interior.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmailRequest(
		@NotBlank String name,
		@Email @NotBlank String email,
		@NotBlank String message
) {
}