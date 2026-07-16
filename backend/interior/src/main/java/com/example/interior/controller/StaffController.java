package com.example.interior.controller;

import com.example.interior.dto.OrderDto;
import com.example.interior.dto.request.StaffOrderUpdateRequest;
import com.example.interior.repository.OrderRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

	private final OrderRepository orderRepository;
	private final OrderController orderController;

	public StaffController(OrderRepository orderRepository, OrderController orderController) {
		this.orderRepository = orderRepository;
		this.orderController = orderController;
	}

	@GetMapping("/orderToday")
	@PreAuthorize("hasAnyRole('STAFF','ADMIN')")
	public List<OrderDto> orderToday() {
		LocalDateTime start = LocalDateTime.now().toLocalDate().atStartOfDay();
		LocalDateTime end = LocalDateTime.now().toLocalDate().atTime(LocalTime.MAX);
		return orderRepository.findToday(start, end).stream().map(order -> orderController.findByIdAdmin(order.getId())).toList();
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('STAFF','ADMIN')")
	public OrderDto findById(@PathVariable Long id) {
		return orderController.findByIdAdmin(id);
	}

	@PostMapping
	@PreAuthorize("hasAnyRole('STAFF','ADMIN')")
	public OrderDto update(@RequestBody StaffOrderUpdateRequest request) {
		return orderController.staffUpdate(request);
	}
}