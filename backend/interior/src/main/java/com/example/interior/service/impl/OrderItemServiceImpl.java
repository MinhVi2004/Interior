package com.example.interior.service.impl;

import com.example.interior.dto.OrderItemDto;
import com.example.interior.entity.Order;
import com.example.interior.entity.OrderItem;
import com.example.interior.entity.Product;
import com.example.interior.entity.Variant;
import com.example.interior.repository.OrderItemRepository;
import com.example.interior.repository.OrderRepository;
import com.example.interior.repository.ProductRepository;
import com.example.interior.repository.VariantRepository;
import com.example.interior.service.OrderItemService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class OrderItemServiceImpl implements OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final VariantRepository variantRepository;

    public OrderItemServiceImpl(OrderItemRepository orderItemRepository, OrderRepository orderRepository, ProductRepository productRepository, VariantRepository variantRepository) {
        this.orderItemRepository = orderItemRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
    }

    @Override
    public List<OrderItemDto> findAll() {
        return orderItemRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public OrderItemDto findById(Long id) {
        return toDto(orderItemRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("OrderItem not found: " + id)));
    }

    @Override
    public OrderItemDto save(OrderItemDto dto) {
        return toDto(orderItemRepository.save(toEntity(new OrderItem(), dto)));
    }

    @Override
    public OrderItemDto update(Long id, OrderItemDto dto) {
        OrderItem orderItem = orderItemRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("OrderItem not found: " + id));
        return toDto(orderItemRepository.save(toEntity(orderItem, dto)));
    }

    @Override
    public void delete(Long id) {
        orderItemRepository.deleteById(id);
    }

    private OrderItem toEntity(OrderItem orderItem, OrderItemDto dto) {
        orderItem.setQuantity(dto.quantity());
        orderItem.setPrice(dto.price());
        orderItem.setSize(dto.size());
        if (dto.orderId() != null) {
            Order order = orderRepository.findById(dto.orderId()).orElseThrow(() -> new IllegalArgumentException("Order not found: " + dto.orderId()));
            orderItem.setOrder(order);
        } else {
            orderItem.setOrder(null);
        }
        if (dto.productId() != null) {
            Product product = productRepository.findById(dto.productId()).orElseThrow(() -> new IllegalArgumentException("Product not found: " + dto.productId()));
            orderItem.setProduct(product);
        } else {
            orderItem.setProduct(null);
        }
        if (dto.variantId() != null) {
            Variant variant = variantRepository.findById(dto.variantId()).orElseThrow(() -> new IllegalArgumentException("Variant not found: " + dto.variantId()));
            orderItem.setVariant(variant);
        } else {
            orderItem.setVariant(null);
        }
        return orderItem;
    }

    private OrderItemDto toDto(OrderItem orderItem) {
        return new OrderItemDto(orderItem.getId(), orderItem.getOrder() == null ? null : orderItem.getOrder().getId(), orderItem.getProduct() == null ? null : orderItem.getProduct().getId(), orderItem.getVariant() == null ? null : orderItem.getVariant().getId(), orderItem.getQuantity(), orderItem.getPrice(), orderItem.getSize());
    }
}