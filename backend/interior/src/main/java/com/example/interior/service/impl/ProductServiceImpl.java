package com.example.interior.service.impl;

import com.example.interior.dto.ProductDto;
import com.example.interior.dto.ProductImageDto;
import com.example.interior.entity.Category;
import com.example.interior.entity.Product;
import com.example.interior.repository.CategoryRepository;
import com.example.interior.repository.ProductRepository;
import com.example.interior.service.ProductService;
import com.example.interior.service.support.EntityMapperSupport;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductServiceImpl extends EntityMapperSupport implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<ProductDto> findAll() {
        return productRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public ProductDto findById(Long id) {
        return toDto(productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Product not found: " + id)));
    }

    @Override
    public ProductDto save(ProductDto dto) {
        return toDto(productRepository.save(toEntity(new Product(), dto)));
    }

    @Override
    public ProductDto update(Long id, ProductDto dto) {
        Product product = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
        return toDto(productRepository.save(toEntity(product, dto)));
    }

    @Override
    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    private Product toEntity(Product product, ProductDto dto) {
        product.setSku(dto.sku());
        product.setName(dto.name());
        product.setDescription(dto.description());
        product.setPrice(dto.price());
        product.setQuantity(dto.quantity());
        product.setQrCodeUrl(dto.qrCodeUrl());
        if (dto.categoryId() != null) {
            Category category = categoryRepository.findById(dto.categoryId()).orElseThrow(() -> new IllegalArgumentException("Category not found: " + dto.categoryId()));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }
        return product;
    }

    private ProductDto toDto(Product product) {

        List<ProductImageDto> images = product.getImages() == null
                ? List.of()
                : product.getImages().stream()
                .map(image -> new ProductImageDto(
                        image.getId(),
                        image.getUrl(),
                        image.getPublicId(),
                        product.getId()
                ))
                .toList();

        return new ProductDto(
                product.getId(),
                product.getSku(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getQuantity(),
                product.getQrCodeUrl(),
                product.getCategory() == null ? null : product.getCategory().getId(),
                product.getThumbnail(),
                product.getCreatedAt()
        );
    }
}