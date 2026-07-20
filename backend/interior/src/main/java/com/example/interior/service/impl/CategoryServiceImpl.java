package com.example.interior.service.impl;

import com.example.interior.dto.CategoryDto;
import com.example.interior.dto.response.UploadResponse;
import com.example.interior.entity.Category;
import com.example.interior.repository.CategoryRepository;
import com.example.interior.service.CategoryService;
import com.example.interior.service.CloudinaryService;
import com.example.interior.service.support.EntityMapperSupport;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Transactional
public class CategoryServiceImpl extends EntityMapperSupport implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CloudinaryService cloudinaryService;

    public CategoryServiceImpl(CategoryRepository categoryRepository,
                               CloudinaryService cloudinaryService) {
        this.categoryRepository = categoryRepository;
        this.cloudinaryService = cloudinaryService;
    }

    @Override
    public List<CategoryDto> findAll() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public CategoryDto findById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Category not found: " + id));

        return toDto(category);
    }

    @Override
    public CategoryDto save(String name, MultipartFile image) {

        Category category = new Category();

        category.setName(name);

        if (image != null && !image.isEmpty()) {

            UploadResponse upload = cloudinaryService.upload(image, "categories");

            category.setImage(upload.url());
            category.setPublicId(upload.publicId());
        }

        return toDto(categoryRepository.save(category));
    }

    @Override
    public CategoryDto update(Long id,
                              String name,
                              MultipartFile image) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Category not found: " + id));

        category.setName(name);

        if (image != null && !image.isEmpty()) {

            // Xóa ảnh cũ
            if (category.getPublicId() != null && !category.getPublicId().isBlank()) {
                cloudinaryService.delete(category.getPublicId());
            }

            // Upload ảnh mới
            UploadResponse upload = cloudinaryService.upload(image, "categories");

            category.setImage(upload.url());
            category.setPublicId(upload.publicId());
        }

        return toDto(categoryRepository.save(category));
    }

    @Override
    public void delete(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Category not found: " + id));

        // Xóa ảnh trên Cloudinary
        if (category.getPublicId() != null && !category.getPublicId().isBlank()) {
            cloudinaryService.delete(category.getPublicId());
        }

        categoryRepository.delete(category);
    }

    private CategoryDto toDto(Category category) {
        return new CategoryDto(
                category.getId(),
                category.getName(),
                category.getImage(),
                category.getPublicId(),
                idsOf(category.getProducts())
        );
    }
}