package com.example.interior.service;

import com.example.interior.dto.OrderDto;

import java.util.List;

public interface OrderService {

    List<OrderDto> findAll();

    OrderDto findById(Long id);

    OrderDto save(OrderDto dto);

    OrderDto update(Long id, OrderDto dto);

    void delete(Long id);
}