package com.example.interior.dto;

public record CartItemDto(
        Long id,
        Long cartId,
        Long productId,
        Long variantId,
        String size,
        Integer quantity
) {
}