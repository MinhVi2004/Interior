package com.example.interior.service.impl;

import com.example.interior.dto.OrderDto;
import com.example.interior.entity.Address;
import com.example.interior.entity.Order;
import com.example.interior.entity.User;
import com.example.interior.repository.AddressRepository;
import com.example.interior.repository.OrderRepository;
import com.example.interior.repository.UserRepository;
import com.example.interior.service.OrderService;
import com.example.interior.service.support.EntityMapperSupport;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class OrderServiceImpl extends EntityMapperSupport implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    public OrderServiceImpl(OrderRepository orderRepository, UserRepository userRepository, AddressRepository addressRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
    }

    @Override
    public List<OrderDto> findAll() {
        return orderRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public OrderDto findById(Long id) {
        return toDto(orderRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Order not found: " + id)));
    }

    @Override
    public OrderDto save(OrderDto dto) {
        return toDto(orderRepository.save(toEntity(new Order(), dto)));
    }

    @Override
    public OrderDto update(Long id, OrderDto dto) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Order not found: " + id));
        return toDto(orderRepository.save(toEntity(order, dto)));
    }

    @Override
    public void delete(Long id) {
        orderRepository.deleteById(id);
    }

    private Order toEntity(Order order, OrderDto dto) {
        order.setPaymentMethod(dto.paymentMethod());
        order.setRetryCount(dto.retryCount());
        order.setTotalAmount(dto.totalAmount());
        order.setIsPaid(dto.isPaid());
        order.setPaidAt(dto.paidAt());
        order.setStatus(dto.status());
        if (dto.userId() != null) {
            User user = userRepository.findById(dto.userId()).orElseThrow(() -> new IllegalArgumentException("User not found: " + dto.userId()));
            order.setUser(user);
        } else {
            order.setUser(null);
        }
        if (dto.addressId() != null) {
            Address address = addressRepository.findById(dto.addressId()).orElseThrow(() -> new IllegalArgumentException("Address not found: " + dto.addressId()));
            order.setAddress(address);
        } else {
            order.setAddress(null);
        }
        return order;
    }

    private OrderDto toDto(Order order) {
        return new OrderDto(order.getId(), order.getUser() == null ? null : order.getUser().getId(), order.getAddress() == null ? null : order.getAddress().getId(), order.getPaymentMethod(), order.getRetryCount(), order.getTotalAmount(), order.getIsPaid(), order.getPaidAt(), order.getStatus(), idsOf(order.getOrderItems()));
    }
}