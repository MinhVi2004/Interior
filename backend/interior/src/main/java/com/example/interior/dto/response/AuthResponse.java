package com.example.interior.dto.response;

public record AuthResponse(
		String accessToken,
		PublicUserResponse user
) {
}