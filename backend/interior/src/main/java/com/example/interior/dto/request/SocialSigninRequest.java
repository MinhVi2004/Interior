package com.example.interior.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record SocialSigninRequest(
		@NotBlank String token,
		@NotBlank String name,
		@Email @NotBlank String email
) {
}