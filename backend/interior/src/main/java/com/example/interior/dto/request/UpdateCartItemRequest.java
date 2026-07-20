package com.example.interior.dto.request;

public record UpdateCartItemRequest(
        Long itemId,
        Integer quantity
) {}