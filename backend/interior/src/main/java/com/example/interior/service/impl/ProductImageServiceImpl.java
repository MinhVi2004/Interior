package com.example.interior.service.impl;

import com.example.interior.dto.ProductImageDto;
import com.example.interior.entity.Product;
import com.example.interior.entity.ProductImage;
import com.example.interior.repository.ProductImageRepository;
import com.example.interior.repository.ProductRepository;
import com.example.interior.service.ProductImageService;
import com.example.interior.service.support.EntityMapperSupport;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductImageServiceImpl extends EntityMapperSupport implements ProductImageService {

    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;

    public ProductImageServiceImpl(ProductImageRepository productImageRepository, ProductRepository productRepository) {
        this.productImageRepository = productImageRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<ProductImageDto> findAll() {
        return productImageRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public ProductImageDto findById(Long id) {
        return toDto(productImageRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("ProductImage not found: " + id)));
    }

    @Override
    public ProductImageDto save(ProductImageDto dto) {
        return toDto(productImageRepository.save(toEntity(new ProductImage(), dto)));
    }

    @Override
    public ProductImageDto update(Long id, ProductImageDto dto) {
        ProductImage productImage = productImageRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("ProductImage not found: " + id));
        return toDto(productImageRepository.save(toEntity(productImage, dto)));
    }

    @Override
    public void delete(Long id) {
        productImageRepository.deleteById(id);
    }

    private ProductImage toEntity(ProductImage productImage, ProductImageDto dto) {
        productImage.setUrl(dto.url());
        productImage.setPublicId(dto.publicId());
        if (dto.productId() != null) {
            Product product = productRepository.findById(dto.productId()).orElseThrow(() -> new IllegalArgumentException("Product not found: " + dto.productId()));
            productImage.setProduct(product);
        } else {
            productImage.setProduct(null);
        }
        return productImage;
    }

    private ProductImageDto toDto(ProductImage productImage) {
        return new ProductImageDto(productImage.getId(), productImage.getUrl(), productImage.getPublicId(), productImage.getProduct() == null ? null : productImage.getProduct().getId());
    }
}