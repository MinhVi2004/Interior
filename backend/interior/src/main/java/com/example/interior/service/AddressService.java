package com.example.interior.service;

import com.example.interior.dto.AddressDto;

import java.util.List;

public interface AddressService {

    List<AddressDto> findAll();

    AddressDto findById(Long id);

    AddressDto save(AddressDto dto);

    AddressDto update(Long id, AddressDto dto);

    void delete(Long id);
}