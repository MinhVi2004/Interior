package com.example.interior.service.impl;

import com.example.interior.dto.CartDto;
import com.example.interior.entity.Cart;
import com.example.interior.entity.User;
import com.example.interior.repository.CartRepository;
import com.example.interior.repository.UserRepository;
import com.example.interior.service.CartService;
import com.example.interior.service.support.EntityMapperSupport;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CartServiceImpl extends EntityMapperSupport implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    public CartServiceImpl(CartRepository cartRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<CartDto> findAll() {
        return cartRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public CartDto findById(Long id) {
        return toDto(cartRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Cart not found: " + id)));
    }

    @Override
    public CartDto save(CartDto dto) {
        return toDto(cartRepository.save(toEntity(new Cart(), dto)));
    }

    @Override
    public CartDto update(Long id, CartDto dto) {
        Cart cart = cartRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Cart not found: " + id));
        return toDto(cartRepository.save(toEntity(cart, dto)));
    }

    @Override
    public void delete(Long id) {
        cartRepository.deleteById(id);
    }

    private Cart toEntity(Cart cart, CartDto dto) {
        if (dto.userId() != null) {
            User user = userRepository.findById(dto.userId()).orElseThrow(() -> new IllegalArgumentException("User not found: " + dto.userId()));
            cart.setUser(user);
        } else {
            cart.setUser(null);
        }
        return cart;
    }

    private CartDto toDto(Cart cart) {
        return new CartDto(cart.getId(), cart.getUser() == null ? null : cart.getUser().getId(), idsOf(cart.getItems()));
    }
}