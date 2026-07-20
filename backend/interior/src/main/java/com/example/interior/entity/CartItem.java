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
@Table(name = "cart_items")
public class CartItem extends BaseEntity {

    @ManyToOne
    private Cart cart;

    @ManyToOne
    private Product product;

    private Integer quantity;
}