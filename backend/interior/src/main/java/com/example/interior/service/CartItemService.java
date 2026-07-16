package com.example.interior.service;

import com.example.interior.dto.CartItemDto;

import java.util.List;

public interface CartItemService {

    List<CartItemDto> findAll();

    CartItemDto findById(Long id);

    CartItemDto save(CartItemDto dto);

    CartItemDto update(Long id, CartItemDto dto);

    void delete(Long id);
}