package com.example.interior.dto;

public record UserPublicDto(
        Long id,
        String name,
        String email,
        String phoneNumber
) {
}
