package com.example.interior.dto.request;

import com.example.interior.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;

public record OrderCreateRequest(
		@NotNull Long addressId,
		@NotNull PaymentMethod paymentMethod
) {
}