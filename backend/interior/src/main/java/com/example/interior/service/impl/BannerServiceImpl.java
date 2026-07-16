package com.example.interior.service.impl;

import com.example.interior.dto.BannerDto;
import com.example.interior.entity.Banner;
import com.example.interior.repository.BannerRepository;
import com.example.interior.service.BannerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BannerServiceImpl implements BannerService {

    private final BannerRepository bannerRepository;

    public BannerServiceImpl(BannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    @Override
    public List<BannerDto> findAll() {
        return bannerRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public BannerDto findById(Long id) {
        return toDto(bannerRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Banner not found: " + id)));
    }

    @Override
    public BannerDto save(BannerDto dto) {
        Banner banner = new Banner();
        banner.setImage(dto.image());
        banner.setPublicId(dto.publicId());
        return toDto(bannerRepository.save(banner));
    }

    @Override
    public BannerDto update(Long id, BannerDto dto) {
        Banner banner = bannerRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Banner not found: " + id));
        banner.setImage(dto.image());
        banner.setPublicId(dto.publicId());
        return toDto(bannerRepository.save(banner));
    }

    @Override
    public void delete(Long id) {
        bannerRepository.deleteById(id);
    }

    private BannerDto toDto(Banner banner) {
        return new BannerDto(banner.getId(), banner.getImage(), banner.getPublicId());
    }
}