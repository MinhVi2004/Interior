package com.example.interior.repository;

import com.example.interior.entity.Order;
import com.example.interior.enums.OrderStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

	List<Order> findByUserId(Long userId);

	List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

	List<Order> findByStatus(OrderStatus status);

	@Query("select o from Order o where o.createdAt between :start and :end order by o.createdAt desc")
	List<Order> findToday(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}