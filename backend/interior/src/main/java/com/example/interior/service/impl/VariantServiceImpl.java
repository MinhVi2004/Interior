package com.example.interior.service.impl;

import com.example.interior.dto.VariantDto;
import com.example.interior.entity.Product;
import com.example.interior.entity.Variant;
import com.example.interior.repository.ProductRepository;
import com.example.interior.repository.VariantRepository;
import com.example.interior.service.VariantService;
import com.example.interior.service.support.EntityMapperSupport;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class VariantServiceImpl extends EntityMapperSupport implements VariantService {

    private final VariantRepository variantRepository;
    private final ProductRepository productRepository;

    public VariantServiceImpl(VariantRepository variantRepository, ProductRepository productRepository) {
        this.variantRepository = variantRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<VariantDto> findAll() {
        return variantRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public VariantDto findById(Long id) {
        return toDto(variantRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Variant not found: " + id)));
    }

    @Override
    public VariantDto save(VariantDto dto) {
        return toDto(variantRepository.save(toEntity(new Variant(), dto)));
    }

    @Override
    public VariantDto update(Long id, VariantDto dto) {
        Variant variant = variantRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Variant not found: " + id));
        return toDto(variantRepository.save(toEntity(variant, dto)));
    }

    @Override
    public void delete(Long id) {
        variantRepository.deleteById(id);
    }

    private Variant toEntity(Variant variant, VariantDto dto) {
        variant.setColor(dto.color());
        variant.setImage(dto.image());
        variant.setPublicId(dto.publicId());
        if (dto.productId() != null) {
            Product product = productRepository.findById(dto.productId()).orElseThrow(() -> new IllegalArgumentException("Product not found: " + dto.productId()));
            variant.setProduct(product);
        } else {
            variant.setProduct(null);
        }
        return variant;
    }

    private VariantDto toDto(Variant variant) {
        return new VariantDto(variant.getId(), variant.getColor(), variant.getImage(), variant.getPublicId(), variant.getProduct() == null ? null : variant.getProduct().getId(), idsOf(variant.getSizes()));
    }
}