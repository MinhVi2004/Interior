package com.example.interior.repository;

import com.example.interior.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

	Page<Product> findAllByOrderByCreatedAtDesc(Pageable pageable);

	Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

	@Query("select p from Product p where lower(p.name) like lower(concat('%', :keyword, '%')) or lower(p.sku) like lower(concat('%', :keyword, '%'))")
	Page<Product> search(@Param("keyword") String keyword, Pageable pageable);

	@Query("select p from Product p join CartItem ci on ci.product = p where ci.id = :cartItemId")
	Product findByCartItemId(@Param("cartItemId") Long cartItemId);
}