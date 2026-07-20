package com.example.interior.entity;

import com.example.interior.common.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "banners")
public class Banner extends BaseEntity {

    private String image;
    private String publicId;
}