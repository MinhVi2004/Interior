package com.example.interior.dto.request;

import com.example.interior.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record StaffOrderUpdateRequest(
		@NotNull Long orderId,
		@NotNull OrderStatus status
) {
}