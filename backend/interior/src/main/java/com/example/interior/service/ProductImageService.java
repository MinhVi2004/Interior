package com.example.interior.service;

import com.example.interior.dto.ProductImageDto;

import java.util.List;

public interface ProductImageService {

    List<ProductImageDto> findAll();

    ProductImageDto findById(Long id);

    ProductImageDto save(ProductImageDto dto);

    ProductImageDto update(Long id, ProductImageDto dto);

    void delete(Long id);
}