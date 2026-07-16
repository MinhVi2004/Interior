package com.example.interior.service;

import com.example.interior.dto.OrderItemDto;

import java.util.List;

public interface OrderItemService {

    List<OrderItemDto> findAll();

    OrderItemDto findById(Long id);

    OrderItemDto save(OrderItemDto dto);

    OrderItemDto update(Long id, OrderItemDto dto);

    void delete(Long id);
}