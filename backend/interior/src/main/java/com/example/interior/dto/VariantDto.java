package com.example.interior.dto;

import java.util.List;

public record VariantDto(
        Long id,
        String color,
        String image,
        String publicId,
        Long productId,
        List<Long> sizeIds
) {
}