package com.example.interior.service.impl;

import com.example.interior.dto.UserDto;
import com.example.interior.entity.User;
import com.example.interior.repository.AddressRepository;
import com.example.interior.repository.CartRepository;
import com.example.interior.repository.OrderRepository;
import com.example.interior.repository.UserRepository;
import com.example.interior.service.UserService;
import com.example.interior.service.support.EntityMapperSupport;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserServiceImpl extends EntityMapperSupport implements UserService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;

    public UserServiceImpl(UserRepository userRepository, AddressRepository addressRepository, CartRepository cartRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public List<UserDto> findAll() {
        return userRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public UserDto findById(Long id) {
        return toDto(userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found: " + id)));
    }

    @Override
    public UserDto save(UserDto dto) {
        return toDto(userRepository.save(toEntity(new User(), dto)));
    }

    @Override
    public UserDto update(Long id, UserDto dto) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        return toDto(userRepository.save(toEntity(user, dto)));
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    private User toEntity(User user, UserDto dto) {
        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPassword(dto.password());
        user.setPoint(dto.point());
        user.setRole(dto.role());
        user.setType(dto.type());
        user.setIsVerified(dto.isVerified());
        user.setVerifyToken(dto.verifyToken());
        user.setStatus(dto.status());
        return user;
    }

    private UserDto toDto(User user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getPoint(),
                user.getRole(),
                user.getType(),
                user.getIsVerified(),
                user.getVerifyToken(),
                user.getStatus(),
                idsOf(user.getAddresses()),
                user.getCart() == null ? null : user.getCart().getId(),
                idsOf(user.getOrders())
        );
    }
}