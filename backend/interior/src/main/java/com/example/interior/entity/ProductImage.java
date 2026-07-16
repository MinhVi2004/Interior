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
@Table(name = "product_images")
public class ProductImage extends BaseEntity {

    private String url;

    private String publicId;

    @ManyToOne
    private Product product;
}