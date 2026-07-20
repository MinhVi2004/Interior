package com.example.interior.repository;

import com.example.interior.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {

	List<ProductImage> findByProductId(Long productId);
	Optional<ProductImage> findFirstByProductIdOrderByIdAsc(Long productId);
}