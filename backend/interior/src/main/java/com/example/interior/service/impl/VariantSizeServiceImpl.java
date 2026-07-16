package com.example.interior.service.impl;

import com.example.interior.dto.VariantSizeDto;
import com.example.interior.entity.Variant;
import com.example.interior.entity.VariantSize;
import com.example.interior.repository.VariantRepository;
import com.example.interior.repository.VariantSizeRepository;
import com.example.interior.service.VariantSizeService;
import com.example.interior.service.support.EntityMapperSupport;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class VariantSizeServiceImpl extends EntityMapperSupport implements VariantSizeService {

    private final VariantSizeRepository variantSizeRepository;
    private final VariantRepository variantRepository;

    public VariantSizeServiceImpl(VariantSizeRepository variantSizeRepository, VariantRepository variantRepository) {
        this.variantSizeRepository = variantSizeRepository;
        this.variantRepository = variantRepository;
    }

    @Override
    public List<VariantSizeDto> findAll() {
        return variantSizeRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public VariantSizeDto findById(Long id) {
        return toDto(variantSizeRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("VariantSize not found: " + id)));
    }

    @Override
    public VariantSizeDto save(VariantSizeDto dto) {
        return toDto(variantSizeRepository.save(toEntity(new VariantSize(), dto)));
    }

    @Override
    public VariantSizeDto update(Long id, VariantSizeDto dto) {
        VariantSize variantSize = variantSizeRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("VariantSize not found: " + id));
        return toDto(variantSizeRepository.save(toEntity(variantSize, dto)));
    }

    @Override
    public void delete(Long id) {
        variantSizeRepository.deleteById(id);
    }

    private VariantSize toEntity(VariantSize variantSize, VariantSizeDto dto) {
        variantSize.setSize(dto.size());
        variantSize.setQuantity(dto.quantity());
        variantSize.setPrice(dto.price());
        variantSize.setQrCodeUrl(dto.qrCodeUrl());
        if (dto.variantId() != null) {
            Variant variant = variantRepository.findById(dto.variantId()).orElseThrow(() -> new IllegalArgumentException("Variant not found: " + dto.variantId()));
            variantSize.setVariant(variant);
        } else {
            variantSize.setVariant(null);
        }
        return variantSize;
    }

    private VariantSizeDto toDto(VariantSize variantSize) {
        return new VariantSizeDto(variantSize.getId(), variantSize.getSize(), variantSize.getQuantity(), variantSize.getPrice(), variantSize.getQrCodeUrl(), variantSize.getVariant() == null ? null : variantSize.getVariant().getId());
    }
}