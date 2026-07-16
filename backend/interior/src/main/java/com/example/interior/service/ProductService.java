package com.example.interior.service;

import com.example.interior.dto.ProductDto;

import java.util.List;

public interface ProductService {

    List<ProductDto> findAll();

    ProductDto findById(Long id);

    ProductDto save(ProductDto dto);

    ProductDto update(Long id, ProductDto dto);

    void delete(Long id);
}