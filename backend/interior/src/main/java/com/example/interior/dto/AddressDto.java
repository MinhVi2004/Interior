package com.example.interior.dto;

public record AddressDto(
        Long id,
        String fullName,
        String phoneNumber,
        String province,
        String district,
        String ward,
        String detail,
        String fullAddress,
        Boolean isDefault,
        Long userId
) {
}