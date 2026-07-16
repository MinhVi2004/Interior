package com.example.interior.service;

import com.example.interior.dto.BannerDto;

import java.util.List;

public interface BannerService {

    List<BannerDto> findAll();

    BannerDto findById(Long id);

    BannerDto save(BannerDto dto);

    BannerDto update(Long id, BannerDto dto);

    void delete(Long id);
}