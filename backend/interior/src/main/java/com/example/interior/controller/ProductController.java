package com.example.interior.controller;

import com.example.interior.dto.ProductDto;
import com.example.interior.dto.ProductImageDto;
import com.example.interior.dto.request.ProductUpsertRequest;
import com.example.interior.dto.response.ProductDetailDto;
import com.example.interior.entity.Category;
import com.example.interior.entity.Product;
import com.example.interior.entity.ProductImage;
import com.example.interior.repository.CartItemRepository;
import com.example.interior.repository.CategoryRepository;
import com.example.interior.repository.ProductImageRepository;
import com.example.interior.repository.ProductRepository;
import com.example.interior.service.CloudinaryService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.text.Normalizer;
import java.util.Locale;
@RestController
@RequestMapping("/api/product")
public class ProductController {

	private final ProductRepository productRepository;
	private final ProductImageRepository productImageRepository;
	private final CategoryRepository categoryRepository;
	private final CartItemRepository cartItemRepository;
	private final CloudinaryService cloudinaryService;

	public ProductController(ProductRepository productRepository, ProductImageRepository productImageRepository, CategoryRepository categoryRepository, CartItemRepository cartItemRepository, CloudinaryService cloudinaryService) {
		this.productRepository = productRepository;
		this.productImageRepository = productImageRepository;
		this.categoryRepository = categoryRepository;
		this.cartItemRepository = cartItemRepository;
		this.cloudinaryService = cloudinaryService;
	}
	private ProductDetailDto toDetailDto(Product product) {

		List<ProductImage> productImages = productImageRepository.findByProductId(product.getId());

		String thumbnail = productImages.isEmpty()
				? null
				: productImages.get(0).getUrl();

		List<ProductImageDto> images = productImages.stream()
				.map(image -> new ProductImageDto(
						image.getId(),
						image.getUrl(),
						image.getPublicId(),
						product.getId()
				))
				.toList();

		return new ProductDetailDto(
				product.getId(),
				product.getSku(),
				product.getName(),
				product.getDescription(),
				product.getPrice(),
				product.getQuantity(),
				product.getQrCodeUrl(),
				product.getCategory() == null
						? null
						: product.getCategory().getId(),
				thumbnail,
				images,
				product.getCreatedAt()
		);
	}
	@GetMapping("/sku/{sku}")
	public ProductDetailDto findBySku(@PathVariable String sku) {
		Product product = productRepository.findBySku(sku)
				.orElseThrow(() -> new IllegalArgumentException("Product not found: " + sku));

		return toDetailDto(product);
	}
	private String generateSku(String name) {

		String base = Normalizer.normalize(name, Normalizer.Form.NFD)
				.replaceAll("\\p{M}", "")
				.replace("đ", "d")
				.replace("Đ", "D")
				.toUpperCase(Locale.ROOT)
				.replaceAll("[^A-Z0-9]+", "-")
				.replaceAll("(^-|-$)", "");

		String sku = base;

		int index = 1;

		while (productRepository.existsBySku(sku)) {
			sku = base + "-" + index++;
		}

		return sku;
	}
	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	@Transactional
	public ProductDto create(@Valid @RequestPart("data") ProductUpsertRequest request, @RequestPart(value = "images", required = false) MultipartFile[] images) {
		Product product = new Product();
		applyProductRequest(product, request);
		product = productRepository.save(product);
		saveImages(product, images);
		return toDto(productRepository.findById(product.getId()).orElseThrow());
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	@Transactional
	public ProductDto update(@PathVariable Long id, @Valid @RequestPart("data") ProductUpsertRequest request, @RequestPart(value = "images", required = false) MultipartFile[] images) {
		Product product = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
		applyProductRequest(product, request);
		product = productRepository.save(product);
		if (images != null && images.length > 0) {
			replaceImages(product, images);
		}
		return toDto(productRepository.findById(id).orElseThrow());
	}

	@GetMapping
	public List<ProductDto> findAll(@RequestParam(defaultValue = "0") int page,
								@RequestParam(defaultValue = "20") int size,
								@RequestParam(required = false) String search) {
			Pageable pageable = PageRequest.of(page, size);
			List<Product> products = (search == null || search.isBlank())
					? productRepository.findAllByOrderByCreatedAtDesc(pageable).getContent()
					: productRepository.search(search, pageable).getContent();
			return products.stream().map(this::toDto).toList();
	}

	@GetMapping("/category/{id}")
	public List<ProductDto> findByCategory(@PathVariable Long id, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
		return productRepository.findByCategoryId(id, PageRequest.of(page, size)).getContent().stream().map(this::toDto).toList();
	}

	@GetMapping("/cart/{id}")
	public ProductDto findByCartItem(@PathVariable Long id) {
		return toDto(productRepository.findByCartItemId(id));
	}

	@GetMapping("/{id}")
	public ProductDto findById(@PathVariable Long id) {
		return toDto(productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Product not found: " + id)));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	@Transactional
	public void delete(@PathVariable Long id) {
		List<ProductImage> images = productImageRepository.findByProductId(id);
		images.forEach(image -> cloudinaryService.delete(image.getPublicId()));
		productImageRepository.deleteAll(images);
		productRepository.deleteById(id);
	}

	private void applyProductRequest(Product product, ProductUpsertRequest request) {
		if (product.getSku() == null || product.getSku().isBlank()) {
			product.setSku(generateSku(request.name()));
		}
		product.setName(request.name());
		product.setDescription(request.description());
		product.setPrice(request.price());
		product.setQuantity(request.quantity());
		product.setQrCodeUrl(request.qrCodeUrl());
		Category category = categoryRepository.findById(request.categoryId()).orElseThrow(() -> new IllegalArgumentException("Category not found: " + request.categoryId()));
		product.setCategory(category);
	}

	private void saveImages(Product product, MultipartFile[] images) {
		if (images == null) {
			return;
		}
		for (MultipartFile file : images) {
			if (file == null || file.isEmpty()) {
				continue;
			}
			var uploaded = cloudinaryService.upload(file, "products");
			ProductImage productImage = new ProductImage();
			productImage.setProduct(product);
			productImage.setUrl(uploaded.url());
			productImage.setPublicId(uploaded.publicId());
			productImageRepository.save(productImage);
		}
	}

	private void replaceImages(Product product, MultipartFile[] images) {
		List<ProductImage> existing = productImageRepository.findByProductId(product.getId());
		existing.forEach(image -> cloudinaryService.delete(image.getPublicId()));
		productImageRepository.deleteAll(existing);
		saveImages(product, images);
	}

	private ProductDto toDto(Product product) {

		List<ProductImage> productImages = productImageRepository.findByProductId(product.getId());

		String thumbnail = productImages.isEmpty()
				? null
				: productImages.get(0).getUrl();

		List<ProductImageDto> images = productImages.stream()
				.map(image -> new ProductImageDto(
						image.getId(),
						image.getUrl(),
						image.getPublicId(),
						product.getId()
				))
				.toList();

		return new ProductDto(
				product.getId(),
				product.getSku(),
				product.getName(),
				product.getDescription(),
				product.getPrice(),
				product.getQuantity(),
				product.getQrCodeUrl(),
				product.getCategory() == null
						? null
						: product.getCategory().getId(),
				thumbnail,
				product.getCreatedAt()
		);
	}
}