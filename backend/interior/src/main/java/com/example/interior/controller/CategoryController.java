package com.example.interior.controller;

import com.example.interior.dto.CategoryDto;
import com.example.interior.repository.CategoryRepository;
import com.example.interior.service.CategoryService;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

	private final CategoryService categoryService;


	public CategoryController(CategoryService categoryService) {
		this.categoryService = categoryService;
	}

	@GetMapping
	public List<CategoryDto> findAll() {
		return categoryService.findAll();
	}

	@GetMapping("/{id}")
	public CategoryDto findById(@PathVariable Long id) {
		return categoryService.findById(id);
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public CategoryDto create(
			@RequestParam("name") String name,
			@RequestParam(value = "image", required = false) MultipartFile image
	) {
		return categoryService.save(name, image);
	}

	@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public CategoryDto update(
			@PathVariable Long id,
			@RequestParam("name") String name,
			@RequestParam(value = "image", required = false) MultipartFile image
	) {
		return categoryService.update(id, name, image);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public void delete(@PathVariable Long id) {
		categoryService.delete(id);
	}
}