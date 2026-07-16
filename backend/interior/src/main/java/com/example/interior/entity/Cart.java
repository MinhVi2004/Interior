package com.example.interior.entity;

import com.example.interior.common.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "carts")
public class Cart extends BaseEntity {

    @OneToOne
    private User user;

    @OneToMany(mappedBy = "cart", cascade = jakarta.persistence.CascadeType.ALL)
    private List<CartItem> items;
}