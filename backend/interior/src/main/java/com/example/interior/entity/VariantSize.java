package com.example.interior.entity;

import com.example.interior.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(
        name = "variant_sizes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"variant_id", "size"})
)
public class VariantSize extends BaseEntity {

    private String size;

    private Integer quantity;

    private Double price;

    @Column(columnDefinition = "LONGTEXT")
    private String qrCodeUrl;

    @ManyToOne
    private Variant variant;
}