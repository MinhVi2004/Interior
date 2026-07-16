package com.example.interior.service;

import com.example.interior.dto.VariantDto;

import java.util.List;

public interface VariantService {

    List<VariantDto> findAll();

    VariantDto findById(Long id);

    VariantDto save(VariantDto dto);

    VariantDto update(Long id, VariantDto dto);

    void delete(Long id);
}