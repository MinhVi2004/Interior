package com.example.interior.controller;

import com.example.interior.dto.CartDto;
import com.example.interior.dto.CartItemDto;
import com.example.interior.entity.Cart;
import com.example.interior.entity.CartItem;
import com.example.interior.entity.Product;
import com.example.interior.entity.Variant;
import com.example.interior.entity.User;
import com.example.interior.repository.CartItemRepository;
import com.example.interior.repository.CartRepository;
import com.example.interior.repository.ProductRepository;
import com.example.interior.repository.VariantRepository;
import com.example.interior.service.support.CurrentUserService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

	private final CartRepository cartRepository;
	private final CartItemRepository cartItemRepository;
	private final ProductRepository productRepository;
	private final VariantRepository variantRepository;
	private final CurrentUserService currentUserService;

	public CartController(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository, VariantRepository variantRepository, CurrentUserService currentUserService) {
		this.cartRepository = cartRepository;
		this.cartItemRepository = cartItemRepository;
		this.productRepository = productRepository;
		this.variantRepository = variantRepository;
		this.currentUserService = currentUserService;
	}

	@GetMapping
	public CartDto findMyCart(Authentication authentication) {
		User user = currentUserService.requireUser(authentication);
		Cart cart = cartRepository.findByUserId(user.getId()).orElseGet(() -> {
			Cart newCart = new Cart();
			newCart.setUser(user);
			return cartRepository.save(newCart);
		});
		return toDto(cart);
	}

	@PostMapping
	@Transactional
	public CartDto addItem(Authentication authentication, @Valid @RequestBody CartItemDto dto) {
		User user = currentUserService.requireUser(authentication);
		Cart cart = cartRepository.findByUserId(user.getId()).orElseGet(() -> {
			Cart newCart = new Cart();
			newCart.setUser(user);
			return cartRepository.save(newCart);
		});
		CartItem cartItem = new CartItem();
		cartItem.setCart(cart);
		cartItem.setQuantity(dto.quantity());
		cartItem.setSize(dto.size());
		if (dto.productId() != null) {
			Product product = productRepository.findById(dto.productId()).orElseThrow(() -> new IllegalArgumentException("Product not found: " + dto.productId()));
			cartItem.setProduct(product);
		}
		if (dto.variantId() != null) {
			Variant variant = variantRepository.findById(dto.variantId()).orElseThrow(() -> new IllegalArgumentException("Variant not found: " + dto.variantId()));
			cartItem.setVariant(variant);
		}
		cartItemRepository.save(cartItem);
		return toDto(cart);
	}

	@PutMapping
	@Transactional
	public CartDto updateItem(Authentication authentication, @Valid @RequestBody CartItemDto dto) {
		User user = currentUserService.requireUser(authentication);
		CartItem cartItem = cartItemRepository.findById(dto.id()).orElseThrow(() -> new IllegalArgumentException("Cart item not found: " + dto.id()));
		if (!cartItem.getCart().getUser().getId().equals(user.getId())) {
			throw new IllegalArgumentException("Not your cart item");
		}
		cartItem.setQuantity(dto.quantity());
		cartItem.setSize(dto.size());
		if (dto.productId() != null) {
			Product product = productRepository.findById(dto.productId()).orElseThrow(() -> new IllegalArgumentException("Product not found: " + dto.productId()));
			cartItem.setProduct(product);
		}
		if (dto.variantId() != null) {
			Variant variant = variantRepository.findById(dto.variantId()).orElseThrow(() -> new IllegalArgumentException("Variant not found: " + dto.variantId()));
			cartItem.setVariant(variant);
		}
		cartItemRepository.save(cartItem);
		return toDto(cartItem.getCart());
	}

	@DeleteMapping("/{id}")
	public void deleteItem(@PathVariable Long id, Authentication authentication) {
		User user = currentUserService.requireUser(authentication);
		CartItem cartItem = cartItemRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Cart item not found: " + id));
		if (!cartItem.getCart().getUser().getId().equals(user.getId())) {
			throw new IllegalArgumentException("Not your cart item");
		}
		cartItemRepository.delete(cartItem);
	}

	private CartDto toDto(Cart cart) {
		List<Long> itemIds = cartItemRepository.findByCartId(cart.getId()).stream().map(CartItem::getId).toList();
		return new CartDto(cart.getId(), cart.getUser() == null ? null : cart.getUser().getId(), itemIds);
	}
}