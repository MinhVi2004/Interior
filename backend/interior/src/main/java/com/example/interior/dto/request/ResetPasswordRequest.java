package com.example.interior.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ResetPasswordRequest(
		@NotBlank String newPassword
) {
}