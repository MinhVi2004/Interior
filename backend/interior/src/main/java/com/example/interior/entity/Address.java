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
@Table(name = "addresses")
public class Address extends BaseEntity {

    private String fullName;

    private String phoneNumber;

    private String province;

    private String district;

    private String ward;

    private String detail;

    private String fullAddress;

    private Boolean isDefault = false;

    @ManyToOne
    private User user;
}