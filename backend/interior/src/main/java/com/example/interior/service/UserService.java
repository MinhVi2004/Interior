package com.example.interior.service;

import com.example.interior.dto.UserDto;

import java.util.List;

public interface UserService {

    List<UserDto> findAll();

    UserDto findById(Long id);

    UserDto save(UserDto dto);

    UserDto update(Long id, UserDto dto);

    void delete(Long id);
}