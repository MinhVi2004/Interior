package com.example.interior.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ProductDto(
        Long id,
        String sku,
        String name,
        String description,
        Double price,
        Integer quantity,
        String qrCodeUrl,
        Long categoryId,
        String thumbnail,
        LocalDateTime createdAt
) {
}