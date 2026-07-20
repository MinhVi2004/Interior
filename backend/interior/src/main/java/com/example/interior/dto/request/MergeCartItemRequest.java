package com.example.interior.dto.request;

import jakarta.validation.constraints.NotNull;

public record MergeCartItemRequest(
        @NotNull Long productId,
        @NotNull Integer quantity
) {
}