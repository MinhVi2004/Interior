package com.example.interior.entity;

import com.example.interior.common.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "order_items")
public class OrderItem extends BaseEntity {

    @ManyToOne
    private Order order;

    @ManyToOne
    private Product product;


    private Integer quantity;

    private Double price;

}