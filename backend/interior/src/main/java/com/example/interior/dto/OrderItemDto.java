package com.example.interior.dto;

public record OrderItemDto(
        Long id,
        Long orderId,
        Long productId,
        Long variantId,
        Integer quantity,
        Double price,
        String size
) {
}