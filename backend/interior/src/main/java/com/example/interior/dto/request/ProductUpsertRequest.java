package com.example.interior.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ProductUpsertRequest(
		String name,
		String description,
		Double price,
		Integer quantity,
		Long categoryId,
		String qrCodeUrl,
		List<String> keepOldImages
) {
}