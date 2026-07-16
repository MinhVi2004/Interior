package com.example.interior.controller;

import com.example.interior.dto.CategoryDto;
import com.example.interior.repository.CategoryRepository;
import com.example.interior.service.CategoryService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

	private final CategoryService categoryService;

	private final CategoryRepository categoryRepository;

	public CategoryController(CategoryService categoryService, CategoryRepository categoryRepository) {
		this.categoryService = categoryService;
		this.categoryRepository = categoryRepository;
	}

	@GetMapping
	public List<CategoryDto> findAll() {
		return categoryService.findAll();
	}

	@GetMapping("/{id}")
	public CategoryDto findById(@PathVariable Long id) {
		return categoryService.findById(id);
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public CategoryDto create(@RequestBody CategoryDto dto) {
		return categoryService.save(dto);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public CategoryDto update(@PathVariable Long id, @RequestBody CategoryDto dto) {
		return categoryService.update(id, dto);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public void delete(@PathVariable Long id) {
		categoryService.delete(id);
	}
}