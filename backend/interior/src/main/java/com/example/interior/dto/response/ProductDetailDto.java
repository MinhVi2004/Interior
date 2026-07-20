package com.example.interior.dto.response;

import com.example.interior.dto.ProductImageDto;

import java.time.LocalDateTime;
import java.util.List;

public record ProductDetailDto(
        Long id,
        String sku,
        String name,
        String description,
        Double price,
        Integer quantity,
        String qrCodeUrl,
        Long categoryId,
        String thumbnail,
        List<ProductImageDto> images,
        LocalDateTime createdAt
) {
}