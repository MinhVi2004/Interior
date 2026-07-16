package com.example.interior.service.impl;

import com.example.interior.dto.CartItemDto;
import com.example.interior.entity.Cart;
import com.example.interior.entity.CartItem;
import com.example.interior.entity.Product;
import com.example.interior.entity.Variant;
import com.example.interior.repository.CartItemRepository;
import com.example.interior.repository.CartRepository;
import com.example.interior.repository.ProductRepository;
import com.example.interior.repository.VariantRepository;
import com.example.interior.service.CartItemService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final VariantRepository variantRepository;

    public CartItemServiceImpl(CartItemRepository cartItemRepository, CartRepository cartRepository, ProductRepository productRepository, VariantRepository variantRepository) {
        this.cartItemRepository = cartItemRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
    }

    @Override
    public List<CartItemDto> findAll() {
        return cartItemRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public CartItemDto findById(Long id) {
        return toDto(cartItemRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("CartItem not found: " + id)));
    }

    @Override
    public CartItemDto save(CartItemDto dto) {
        return toDto(cartItemRepository.save(toEntity(new CartItem(), dto)));
    }

    @Override
    public CartItemDto update(Long id, CartItemDto dto) {
        CartItem cartItem = cartItemRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("CartItem not found: " + id));
        return toDto(cartItemRepository.save(toEntity(cartItem, dto)));
    }

    @Override
    public void delete(Long id) {
        cartItemRepository.deleteById(id);
    }

    private CartItem toEntity(CartItem cartItem, CartItemDto dto) {
        cartItem.setSize(dto.size());
        cartItem.setQuantity(dto.quantity());
        if (dto.cartId() != null) {
            Cart cart = cartRepository.findById(dto.cartId()).orElseThrow(() -> new IllegalArgumentException("Cart not found: " + dto.cartId()));
            cartItem.setCart(cart);
        } else {
            cartItem.setCart(null);
        }
        if (dto.productId() != null) {
            Product product = productRepository.findById(dto.productId()).orElseThrow(() -> new IllegalArgumentException("Product not found: " + dto.productId()));
            cartItem.setProduct(product);
        } else {
            cartItem.setProduct(null);
        }
        if (dto.variantId() != null) {
            Variant variant = variantRepository.findById(dto.variantId()).orElseThrow(() -> new IllegalArgumentException("Variant not found: " + dto.variantId()));
            cartItem.setVariant(variant);
        } else {
            cartItem.setVariant(null);
        }
        return cartItem;
    }

    private CartItemDto toDto(CartItem cartItem) {
        return new CartItemDto(cartItem.getId(), cartItem.getCart() == null ? null : cartItem.getCart().getId(), cartItem.getProduct() == null ? null : cartItem.getProduct().getId(), cartItem.getVariant() == null ? null : cartItem.getVariant().getId(), cartItem.getSize(), cartItem.getQuantity());
    }
}