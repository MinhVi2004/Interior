package com.example.interior.dto.response;

import com.example.interior.enums.LoginType;
import com.example.interior.enums.Role;

import java.util.List;

public record PublicUserResponse(
		Long id,
		String name,
		String email,
		Integer point,
		Role role,
		LoginType type,
		Boolean isVerified,
		Boolean status,
		List<Long> addressIds,
		Long cartId,
		List<Long> orderIds
) {
}