package com.example.interior.service;

import com.example.interior.dto.CategoryDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryService {

    List<CategoryDto> findAll();

    CategoryDto findById(Long id);

    CategoryDto save(String name, MultipartFile image);

    CategoryDto update(Long id, String name, MultipartFile image);

    void delete(Long id);
}