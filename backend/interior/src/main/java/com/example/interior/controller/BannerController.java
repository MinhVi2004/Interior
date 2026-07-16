package com.example.interior.controller;

import com.example.interior.dto.BannerDto;
import com.example.interior.entity.Banner;
import com.example.interior.repository.BannerRepository;
import com.example.interior.service.CloudinaryService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/banner")
public class BannerController {

	private final BannerRepository bannerRepository;
	private final CloudinaryService cloudinaryService;

	public BannerController(BannerRepository bannerRepository, CloudinaryService cloudinaryService) {
		this.bannerRepository = bannerRepository;
		this.cloudinaryService = cloudinaryService;
	}

	@GetMapping
	public List<BannerDto> findAll() {
		return bannerRepository.findAll().stream().map(banner -> new BannerDto(banner.getId(), banner.getImage(), banner.getPublicId())).toList();
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public BannerDto create(@RequestPart("image") MultipartFile image) {
		var uploaded = cloudinaryService.upload(image, "banners");
		Banner banner = new Banner();
		banner.setImage(uploaded.url());
		banner.setPublicId(uploaded.publicId());
		banner = bannerRepository.save(banner);
		return new BannerDto(banner.getId(), banner.getImage(), banner.getPublicId());
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public BannerDto update(@PathVariable Long id, @RequestPart("image") MultipartFile image) {
		Banner banner = bannerRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Banner not found: " + id));
		var uploaded = cloudinaryService.upload(image, "banners");
		cloudinaryService.delete(banner.getPublicId());
		banner.setImage(uploaded.url());
		banner.setPublicId(uploaded.publicId());
		banner = bannerRepository.save(banner);
		return new BannerDto(banner.getId(), banner.getImage(), banner.getPublicId());
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public void delete(@PathVariable Long id) {
		Banner banner = bannerRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Banner not found: " + id));
		cloudinaryService.delete(banner.getPublicId());
		bannerRepository.delete(banner);
	}
}