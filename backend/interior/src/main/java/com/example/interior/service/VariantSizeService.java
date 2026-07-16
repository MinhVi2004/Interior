package com.example.interior.service;

import com.example.interior.dto.VariantSizeDto;

import java.util.List;

public interface VariantSizeService {

    List<VariantSizeDto> findAll();

    VariantSizeDto findById(Long id);

    VariantSizeDto save(VariantSizeDto dto);

    VariantSizeDto update(Long id, VariantSizeDto dto);

    void delete(Long id);
}