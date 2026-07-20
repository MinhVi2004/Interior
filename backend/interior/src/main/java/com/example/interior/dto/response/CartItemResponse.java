package com.example.interior.dto.response;

import com.example.interior.dto.ProductDto;

public record CartItemResponse(
        Long id,
        Integer quantity,
        ProductDto product
) {}