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
        Boolean hasVariant,
        String qrCodeUrl,
        Long categoryId,
        List<ProductImageDto> images,
        List<Long> variantId,
        LocalDateTime createdAt
) {
}