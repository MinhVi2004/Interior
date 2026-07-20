package com.example.interior.dto;

import java.time.LocalDateTime;

public record BannerDto(
        Long id,
        String image,
        String publicId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}