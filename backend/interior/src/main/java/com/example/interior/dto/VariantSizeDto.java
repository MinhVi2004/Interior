package com.example.interior.dto;

public record VariantSizeDto(
        Long id,
        String size,
        Integer quantity,
        Double price,
        String qrCodeUrl,
        Long variantId
) {
}