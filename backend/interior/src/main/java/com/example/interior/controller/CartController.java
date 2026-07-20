package com.example.interior.controller;

import com.example.interior.dto.CartDto;
import com.example.interior.dto.CartItemDto;
import com.example.interior.dto.ProductDto;
import com.example.interior.dto.ProductImageDto;
import com.example.interior.dto.request.MergeCartItemRequest;
import com.example.interior.dto.request.MergeCartRequest;
import com.example.interior.dto.request.UpdateCartItemRequest;
import com.example.interior.dto.response.CartItemResponse;
import com.example.interior.entity.Cart;
import com.example.interior.entity.CartItem;
import com.example.interior.entity.Product;
import com.example.interior.entity.User;
import com.example.interior.repository.CartItemRepository;
import com.example.interior.repository.CartRepository;
import com.example.interior.repository.ProductImageRepository;
import com.example.interior.repository.ProductRepository;
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
	private final CurrentUserService currentUserService;
	private final ProductImageRepository productImageRepository;

	public CartController(CartRepository cartRepository, ProductImageRepository productImageRepository, CartItemRepository cartItemRepository, ProductRepository productRepository, CurrentUserService currentUserService) {
		this.cartRepository = cartRepository;

		this.productImageRepository = productImageRepository;
		this.cartItemRepository = cartItemRepository;
		this.productRepository = productRepository;
		this.currentUserService = currentUserService;
	}

	@PostMapping("/merge")
	@Transactional
	public CartDto mergeCart(
			Authentication authentication,
			@RequestBody MergeCartRequest request) {

		User user = currentUserService.requireUser(authentication);

		Cart cart = cartRepository.findByUserId(user.getId())
				.orElseGet(() -> {
					Cart newCart = new Cart();
					newCart.setUser(user);
					return cartRepository.save(newCart);
				});

		for (MergeCartItemRequest item : request.items()) {

			Product product = productRepository.findById(item.productId())
					.orElseThrow(() ->
							new IllegalArgumentException("Product not found"));

			CartItem cartItem = cartItemRepository
					.findByCartIdAndProductId(cart.getId(), product.getId())
					.orElse(null);

			if (cartItem == null) {
				cartItem = new CartItem();
				cartItem.setCart(cart);
				cartItem.setProduct(product);
				cartItem.setQuantity(item.quantity());
			} else {
				cartItem.setQuantity(
						cartItem.getQuantity() + item.quantity()
				);
			}

			cartItemRepository.save(cartItem);
		}

		return toDto(cart);
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
	public CartDto addItem(Authentication authentication,
	                       @Valid @RequestBody CartItemDto dto) {

		User user = currentUserService.requireUser(authentication);

		Cart cart = cartRepository.findByUserId(user.getId())
				.orElseGet(() -> {
					Cart newCart = new Cart();
					newCart.setUser(user);
					return cartRepository.save(newCart);
				});

		Product product = productRepository.findById(dto.productId())
				.orElseThrow(() ->
						new IllegalArgumentException("Product not found"));

		CartItem cartItem = cartItemRepository
				.findByCartIdAndProductId(cart.getId(), product.getId())
				.orElse(null);

		if (cartItem == null) {
			cartItem = new CartItem();
			cartItem.setCart(cart);
			cartItem.setProduct(product);
			cartItem.setQuantity(dto.quantity());
		} else {
			cartItem.setQuantity(
					cartItem.getQuantity() + dto.quantity()
			);
		}

		cartItemRepository.save(cartItem);

		return toDto(cart);
	}

	@PutMapping
	@Transactional
	public CartDto updateItem(
			Authentication authentication,
			@RequestBody UpdateCartItemRequest request) {

		User user = currentUserService.requireUser(authentication);

		CartItem cartItem = cartItemRepository.findById(request.itemId())
				.orElseThrow(() ->
						new IllegalArgumentException("Cart item not found"));

		if (!cartItem.getCart().getUser().getId().equals(user.getId())) {
			throw new IllegalArgumentException("Not your cart item");
		}

		cartItem.setQuantity(request.quantity());

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

		List<CartItemResponse> items =
				cartItemRepository.findByCartId(cart.getId())
						.stream()
						.map(this::toCartItemResponse)
						.toList();

		return new CartDto(
				cart.getId(),
				cart.getUser() == null ? null : cart.getUser().getId(),
				items
		);
	}
	private CartItemResponse toCartItemResponse(CartItem item) {

		Product product = item.getProduct();

		List<ProductImageDto> images = productImageRepository
				.findByProductId(product.getId())
				.stream()
				.map(image -> new ProductImageDto(
						image.getId(),
						image.getUrl(),
						image.getPublicId(),
						product.getId()
				))
				.toList();

		String thumbnail = images.isEmpty()
				? null
				: images.get(0).url();

		ProductDto productDto = new ProductDto(
				product.getId(),
				product.getSku(),
				product.getName(),
				product.getDescription(),
				product.getPrice(),
				product.getQuantity(),
				product.getQrCodeUrl(),
				product.getCategory() == null ? null : product.getCategory().getId(),
				thumbnail,
				product.getCreatedAt()
		);

		return new CartItemResponse(
				item.getId(),
				item.getQuantity(),
				productDto
		);
	}
}