package com.example.interior.dto;

import com.example.interior.enums.OrderStatus;
import com.example.interior.enums.PaymentMethod;
import java.time.LocalDateTime;
import java.util.List;

public record OrderDetailDto(
        Long id,

        Long userId,

        PaymentMethod paymentMethod,

        OrderStatus status,

        Double totalAmount,

        Boolean isPaid,

        LocalDateTime paidAt,

        LocalDateTime createdAt,

        AddressDto address,

        List<OrderItemDetailDto> items
) {
}