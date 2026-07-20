package com.example.interior.service.support;

import com.example.interior.common.entity.BaseEntity;
import com.example.interior.dto.response.PublicUserResponse;
import com.example.interior.entity.User;

import java.util.List;

public final class UserResponseMapper {

	private UserResponseMapper() {
	}

	public static PublicUserResponse toPublic(User user) {
//		List<Long> addressIds = user.getAddresses() == null ? List.of() : user.getAddresses().stream().map(BaseEntity::getId).toList();
//		List<Long> orderIds = user.getOrders() == null ? List.of() : user.getOrders().stream().map(BaseEntity::getId).toList();
//		Long cartId = user.getCart() == null ? null : user.getCart().getId();
		return new PublicUserResponse(
				user.getId(),
				user.getName(),
				user.getEmail(),
				user.getPoint(),
				user.getRole(),
				user.getType(),
				user.getIsVerified(),
				user.getStatus()
		);
	}
}