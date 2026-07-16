package com.example.interior.entity;

import com.example.interior.common.entity.BaseEntity;
import com.example.interior.enums.OrderStatus;
import com.example.interior.enums.PaymentMethod;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "orders")
public class Order extends BaseEntity {

    @ManyToOne
    private User user;

    @ManyToOne
    private Address address;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private Integer retryCount = 0;

    private Double totalAmount;

    private Boolean isPaid = false;

    private LocalDateTime paidAt;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @OneToMany(mappedBy = "order", cascade = jakarta.persistence.CascadeType.ALL)
    private List<OrderItem> orderItems;
}