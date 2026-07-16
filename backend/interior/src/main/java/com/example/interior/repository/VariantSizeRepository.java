package com.example.interior.repository;

import com.example.interior.entity.VariantSize;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VariantSizeRepository extends JpaRepository<VariantSize, Long> {

	List<VariantSize> findByVariantId(Long variantId);
}