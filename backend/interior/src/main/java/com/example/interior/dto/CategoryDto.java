package com.example.interior.dto;

import java.util.List;

public record CategoryDto(
        Long id,
        String name,
        String image,
        String publicId,
        List<Long> productIds
) {
}