package com.example.interior.dto;

import java.util.List;

public record ProductDto(
        Long id,
        String sku,
        String name,
        String description,
        Double price,
        Integer quantity,
        Boolean hasVariant,
        String qrCodeUrl,
        Long categoryId,
        List<Long> imageIds,
        List<Long> variantIds
) {
}