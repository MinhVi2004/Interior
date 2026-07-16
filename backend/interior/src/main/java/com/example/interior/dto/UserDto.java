package com.example.interior.dto;

import com.example.interior.enums.LoginType;
import com.example.interior.enums.Role;

import java.util.List;

public record UserDto(
        Long id,
        String name,
        String email,
        String password,
        Integer point,
        Role role,
        LoginType type,
        Boolean isVerified,
        String verifyToken,
        Boolean status,
        List<Long> addressIds,
        Long cartId,
        List<Long> orderIds
) {
}