package com.example.interior.controller;

import com.example.interior.dto.AddressDto;
import com.example.interior.entity.Address;
import com.example.interior.entity.User;
import com.example.interior.repository.AddressRepository;
import com.example.interior.repository.UserRepository;
import com.example.interior.service.support.CurrentUserService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
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
@RequestMapping("/api/address")
public class AddressController {

	private final AddressRepository addressRepository;
	private final CurrentUserService currentUserService;
	private final UserRepository userRepository;

	public AddressController(AddressRepository addressRepository, CurrentUserService currentUserService, UserRepository userRepository) {
		this.addressRepository = addressRepository;
		this.currentUserService = currentUserService;
		this.userRepository = userRepository;
	}

	@GetMapping
	public List<AddressDto> findAll(Authentication authentication) {
		User user = currentUserService.requireUser(authentication);
		return addressRepository.findByUserId(user.getId()).stream().map(this::toDto).toList();
	}

	@GetMapping("/{id}")
	public AddressDto findById(@PathVariable Long id) {
		return toDto(addressRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Address not found: " + id)));
	}

	@PostMapping
	@Transactional
	public AddressDto create(Authentication authentication, @Valid @RequestBody AddressDto dto) {
		User user = currentUserService.requireUser(authentication);
		Address address = toEntity(new Address(), dto);
		address.setUser(user);
		address = addressRepository.save(address);
		return toDto(address);
	}

	@PutMapping("/{id}")
	@Transactional
	public AddressDto update(@PathVariable Long id, Authentication authentication, @Valid @RequestBody AddressDto dto) {
		Address address = addressRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Address not found: " + id));
		User user = currentUserService.requireUser(authentication);
		if (!address.getUser().getId().equals(user.getId())) {
			throw new IllegalArgumentException("Not your address");
		}
		address = addressRepository.save(toEntity(address, dto));
		return toDto(address);
	}

	@DeleteMapping("/{id}")
	public void delete(@PathVariable Long id, Authentication authentication) {
		Address address = addressRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Address not found: " + id));
		User user = currentUserService.requireUser(authentication);
		if (!address.getUser().getId().equals(user.getId())) {
			throw new IllegalArgumentException("Not your address");
		}
		addressRepository.delete(address);
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
		return address;
	}

	private AddressDto toDto(Address address) {
		return new AddressDto(address.getId(), address.getFullName(), address.getPhoneNumber(), address.getProvince(), address.getDistrict(), address.getWard(), address.getDetail(), address.getFullAddress(), address.getIsDefault(), address.getUser() == null ? null : address.getUser().getId());
	}
}