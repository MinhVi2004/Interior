package com.example.interior.dto;

public record OrderItemDto(
        Long id,
        Long orderId,
        Long productId,
        Integer quantity,
        Double price
) {
}