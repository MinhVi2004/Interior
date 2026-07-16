package com.example.interior.controller;

import com.example.interior.dto.OrderDto;
import com.example.interior.dto.request.OrderCreateRequest;
import com.example.interior.dto.request.StaffOrderUpdateRequest;
import com.example.interior.dto.response.MessageResponse;
import com.example.interior.entity.Address;
import com.example.interior.entity.Cart;
import com.example.interior.entity.CartItem;
import com.example.interior.entity.Order;
import com.example.interior.entity.OrderItem;
import com.example.interior.entity.User;
import com.example.interior.repository.AddressRepository;
import com.example.interior.repository.CartItemRepository;
import com.example.interior.repository.CartRepository;
import com.example.interior.repository.OrderItemRepository;
import com.example.interior.repository.OrderRepository;
import com.example.interior.repository.UserRepository;
import com.example.interior.service.support.CurrentUserService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
public class OrderController {

	private final OrderRepository orderRepository;
	private final OrderItemRepository orderItemRepository;
	private final CartRepository cartRepository;
	private final CartItemRepository cartItemRepository;
	private final AddressRepository addressRepository;
	private final UserRepository userRepository;
	private final CurrentUserService currentUserService;

	public OrderController(OrderRepository orderRepository, OrderItemRepository orderItemRepository, CartRepository cartRepository, CartItemRepository cartItemRepository, AddressRepository addressRepository, UserRepository userRepository, CurrentUserService currentUserService) {
		this.orderRepository = orderRepository;
		this.orderItemRepository = orderItemRepository;
		this.cartRepository = cartRepository;
		this.cartItemRepository = cartItemRepository;
		this.addressRepository = addressRepository;
		this.userRepository = userRepository;
		this.currentUserService = currentUserService;
	}

	@PostMapping
	@Transactional
	public OrderDto create(Authentication authentication, @Valid @RequestBody OrderCreateRequest request) {
		User user = currentUserService.requireUser(authentication);
		return createOrderFromCart(user, request.addressId(), request.paymentMethod().name(), false);
	}

	@PostMapping("/create-vnpay")
	@Transactional
	public Map<String, Object> createVnpay(Authentication authentication, @Valid @RequestBody OrderCreateRequest request) {
		User user = currentUserService.requireUser(authentication);
		OrderDto order = createOrderFromCart(user, request.addressId(), "VNPAY", true);
		return Map.of("message", "Payment created", "order", order, "paymentUrl", "/api/order/vnpay_ipn?orderId=" + order.id() + "&vnp_ResponseCode=00");
	}

	@GetMapping("/vnpay_ipn")
	@Transactional
	public MessageResponse vnpayIpn(@RequestParam(required = false) Long orderId, @RequestParam(required = false) String vnp_ResponseCode, @RequestParam(required = false) String vnp_TxnRef) {
		Long resolvedOrderId = orderId != null ? orderId : parseLong(vnp_TxnRef);
		if (resolvedOrderId != null && "00".equals(vnp_ResponseCode)) {
			Order order = orderRepository.findById(resolvedOrderId).orElseThrow(() -> new IllegalArgumentException("Order not found: " + resolvedOrderId));
			order.setIsPaid(true);
			order.setPaidAt(LocalDateTime.now());
			orderRepository.save(order);
		}
		return new MessageResponse("IPN processed");
	}

	@GetMapping
	public List<OrderDto> myOrders(Authentication authentication) {
		User user = currentUserService.requireUser(authentication);
		return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream().map(this::toDto).toList();
	}

	@GetMapping("/admin")
	@PreAuthorize("hasRole('ADMIN')")
	public List<OrderDto> findAllAdmin() {
		return orderRepository.findAll().stream().map(this::toDto).toList();
	}

	@GetMapping("/admin/user/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public List<OrderDto> findByUser(@PathVariable Long id) {
		return orderRepository.findByUserIdOrderByCreatedAtDesc(id).stream().map(this::toDto).toList();
	}

	@GetMapping("/admin/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public OrderDto findByIdAdmin(@PathVariable Long id) {
		return toDto(orderRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Order not found: " + id)));
	}

	@PutMapping("/admin/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	@Transactional
	public OrderDto updateAdmin(@PathVariable Long id, @RequestBody OrderDto request) {
		Order order = orderRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Order not found: " + id));
		order.setStatus(request.status());
		order.setIsPaid(request.isPaid());
		order.setPaidAt(request.paidAt());
		order.setRetryCount(request.retryCount());
		return toDto(orderRepository.save(order));
	}

	@PostMapping("/staff")
	@PreAuthorize("hasAnyRole('STAFF','ADMIN')")
	@Transactional
	public OrderDto staffUpdate(@RequestBody StaffOrderUpdateRequest request) {
		Order order = orderRepository.findById(request.orderId()).orElseThrow(() -> new IllegalArgumentException("Order not found: " + request.orderId()));
		order.setStatus(request.status());
		return toDto(orderRepository.save(order));
	}

	@GetMapping("/staff/orderToday")
	@PreAuthorize("hasAnyRole('STAFF','ADMIN')")
	public List<OrderDto> today() {
		LocalDateTime start = LocalDateTime.now().toLocalDate().atStartOfDay();
		LocalDateTime end = LocalDateTime.now().toLocalDate().atTime(LocalTime.MAX);
		return orderRepository.findToday(start, end).stream().map(this::toDto).toList();
	}

	@GetMapping("/staff/{id}")
	@PreAuthorize("hasAnyRole('STAFF','ADMIN')")
	public OrderDto staffFindById(@PathVariable Long id) {
		return toDto(orderRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Order not found: " + id)));
	}

	private OrderDto createOrderFromCart(User user, Long addressId, String paymentMethod, boolean isVnpay) {
		Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow(() -> new IllegalArgumentException("Cart not found"));
		List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
		if (items.isEmpty()) {
			throw new IllegalArgumentException("Cart is empty");
		}
		Address address = addressRepository.findById(addressId).orElseThrow(() -> new IllegalArgumentException("Address not found: " + addressId));
		Order order = new Order();
		order.setUser(user);
		order.setAddress(address);
		order.setPaymentMethod(com.example.interior.enums.PaymentMethod.valueOf(paymentMethod));
		order.setStatus(com.example.interior.enums.OrderStatus.PENDING);
		order.setTotalAmount(items.stream().mapToDouble(item -> {
			Double price = item.getVariant() != null && item.getVariant().getSizes() != null && !item.getVariant().getSizes().isEmpty() ? item.getVariant().getSizes().get(0).getPrice() : item.getProduct().getPrice();
			return (price == null ? 0.0 : price) * (item.getQuantity() == null ? 1 : item.getQuantity());
		}).sum());
		order = orderRepository.save(order);
		for (CartItem cartItem : items) {
			OrderItem orderItem = new OrderItem();
			orderItem.setOrder(order);
			orderItem.setProduct(cartItem.getProduct());
			orderItem.setVariant(cartItem.getVariant());
			orderItem.setQuantity(cartItem.getQuantity());
			Double price = cartItem.getVariant() != null && cartItem.getVariant().getSizes() != null && !cartItem.getVariant().getSizes().isEmpty() ? cartItem.getVariant().getSizes().get(0).getPrice() : cartItem.getProduct().getPrice();
			orderItem.setPrice(price);
			orderItem.setSize(cartItem.getSize());
			orderItemRepository.save(orderItem);
		}
		cartItemRepository.deleteAll(items);
		return toDto(orderRepository.findById(order.getId()).orElseThrow());
	}

	private Long parseLong(String value) {
		try {
			return value == null ? null : Long.parseLong(value);
		} catch (NumberFormatException ex) {
			return null;
		}
	}

	private OrderDto toDto(Order order) {
		List<Long> orderItemIds = orderItemRepository.findByOrderId(order.getId()).stream().map(OrderItem::getId).toList();
		return new OrderDto(order.getId(), order.getUser() == null ? null : order.getUser().getId(), order.getAddress() == null ? null : order.getAddress().getId(), order.getPaymentMethod(), order.getRetryCount(), order.getTotalAmount(), order.getIsPaid(), order.getPaidAt(), order.getStatus(), orderItemIds);
	}
}