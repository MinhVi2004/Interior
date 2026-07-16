package com.example.interior.dto;

public record ProductImageDto(
        Long id,
        String url,
        String publicId,
        Long productId
) {
}