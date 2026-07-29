package com.example.interior.dto;

public record OrderItemDetailDto(
        Long id,
        Integer quantity,
        Double price,
        ProductDto product
) {
}