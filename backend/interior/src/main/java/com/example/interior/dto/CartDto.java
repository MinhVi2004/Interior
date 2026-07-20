package com.example.interior.dto;

import com.example.interior.dto.response.CartItemResponse;

import java.util.List;


public record CartDto(
        Long id,
        Long userId,
        List<CartItemResponse> items
) {}