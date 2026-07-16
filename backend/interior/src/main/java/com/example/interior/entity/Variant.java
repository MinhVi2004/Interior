package com.example.interior.entity;

import com.example.interior.common.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(
        name = "variants",
        uniqueConstraints = @UniqueConstraint(columnNames = {"product_id", "color"})
)
public class Variant extends BaseEntity {

    private String color;

    private String image;

    private String publicId;

    @ManyToOne
    private Product product;

    @OneToMany(mappedBy = "variant", cascade = jakarta.persistence.CascadeType.ALL)
    private List<VariantSize> sizes;
}