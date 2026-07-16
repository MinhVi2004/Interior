package com.example.interior.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProductUpsertRequest(
		@NotBlank String sku,
		String name,
		String description,
		Double price,
		Integer quantity,
		Boolean hasVariant,
		String qrCodeUrl,
		@NotNull Long categoryId
) {
}