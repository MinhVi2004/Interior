package com.example.interior.repository;

import com.example.interior.entity.Variant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VariantRepository extends JpaRepository<Variant, Long> {

	List<Variant> findByProductId(Long productId);
}