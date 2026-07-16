package com.example.interior.dto;

import java.util.List;

public record CartDto(
        Long id,
        Long userId,
        List<Long> itemIds
) {
}