package com.example.interior.service;

import com.example.interior.dto.CartDto;

import java.util.List;

public interface CartService {

    List<CartDto> findAll();

    CartDto findById(Long id);

    CartDto save(CartDto dto);

    CartDto update(Long id, CartDto dto);

    void delete(Long id);
}