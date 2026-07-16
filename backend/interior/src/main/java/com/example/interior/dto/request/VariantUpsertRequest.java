package com.example.interior.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record VariantUpsertRequest(
		@NotBlank String color,
		List<@Valid VariantSizeInput> sizes
) {
	public record VariantSizeInput(String size, Integer quantity, Double price, String qrCodeUrl) {}
}