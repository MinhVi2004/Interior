package com.example.interior.service.impl;

import com.example.interior.dto.AddressDto;
import com.example.interior.entity.Address;
import com.example.interior.entity.User;
import com.example.interior.repository.AddressRepository;
import com.example.interior.repository.UserRepository;
import com.example.interior.service.AddressService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressServiceImpl(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<AddressDto> findAll() {
        return addressRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public AddressDto findById(Long id) {
        return toDto(addressRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Address not found: " + id)));
    }

    @Override
    public AddressDto save(AddressDto dto) {
        return toDto(addressRepository.save(toEntity(new Address(), dto)));
    }

    @Override
    public AddressDto update(Long id, AddressDto dto) {
        Address address = addressRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Address not found: " + id));
        return toDto(addressRepository.save(toEntity(address, dto)));
    }

    @Override
    public void delete(Long id) {
        addressRepository.deleteById(id);
    }

    private Address toEntity(Address address, AddressDto dto) {
        address.setFullName(dto.fullName());
        address.setPhoneNumber(dto.phoneNumber());
        address.setProvince(dto.province());
        address.setDistrict(dto.district());
        address.setWard(dto.ward());
        address.setDetail(dto.detail());
        address.setFullAddress(dto.fullAddress());
        address.setIsDefault(dto.isDefault());
        if (dto.userId() != null) {
            User user = userRepository.findById(dto.userId()).orElseThrow(() -> new IllegalArgumentException("User not found: " + dto.userId()));
            address.setUser(user);
        } else {
            address.setUser(null);
        }
        return address;
    }

    private AddressDto toDto(Address address) {
        return new AddressDto(address.getId(), address.getFullName(), address.getPhoneNumber(), address.getProvince(), address.getDistrict(), address.getWard(), address.getDetail(), address.getFullAddress(), address.getIsDefault(), address.getUser() == null ? null : address.getUser().getId());
    }
}