package com.example.interior.dto;

import com.example.interior.enums.OrderStatus;
import com.example.interior.enums.PaymentMethod;

import java.time.LocalDateTime;
import java.util.List;

public record OrderDto(
        Long id,
        Long userId,
        Long addressId,
        PaymentMethod paymentMethod,
        Integer retryCount,
        Double totalAmount,
        Boolean isPaid,
        LocalDateTime paidAt,
        OrderStatus status,
        List<Long> orderItemIds
) {
}