package com.example.interior.service.impl;

import com.example.interior.dto.CategoryDto;
import com.example.interior.entity.Category;
import com.example.interior.repository.CategoryRepository;
import com.example.interior.service.CategoryService;
import com.example.interior.service.support.EntityMapperSupport;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoryServiceImpl extends EntityMapperSupport implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<CategoryDto> findAll() {
        return categoryRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public CategoryDto findById(Long id) {
        return toDto(categoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Category not found: " + id)));
    }

    @Override
    public CategoryDto save(CategoryDto dto) {
        return toDto(categoryRepository.save(toEntity(new Category(), dto)));
    }

    @Override
    public CategoryDto update(Long id, CategoryDto dto) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Category not found: " + id));
        return toDto(categoryRepository.save(toEntity(category, dto)));
    }

    @Override
    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }

    private Category toEntity(Category category, CategoryDto dto) {
        category.setName(dto.name());
        category.setImage(dto.image());
        category.setPublicId(dto.publicId());
        return category;
    }

    private CategoryDto toDto(Category category) {
        return new CategoryDto(category.getId(), category.getName(), category.getImage(), category.getPublicId(), idsOf(category.getProducts()));
    }
}