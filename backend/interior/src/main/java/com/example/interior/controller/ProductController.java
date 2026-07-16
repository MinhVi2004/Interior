package com.example.interior.controller;

import com.example.interior.dto.ProductDto;
import com.example.interior.dto.VariantDto;
import com.example.interior.dto.VariantSizeDto;
import com.example.interior.dto.request.ProductUpsertRequest;
import com.example.interior.dto.request.VariantUpsertRequest;
import com.example.interior.entity.Category;
import com.example.interior.entity.Product;
import com.example.interior.entity.ProductImage;
import com.example.interior.entity.Variant;
import com.example.interior.entity.VariantSize;
import com.example.interior.repository.CartItemRepository;
import com.example.interior.repository.CategoryRepository;
import com.example.interior.repository.ProductImageRepository;
import com.example.interior.repository.ProductRepository;
import com.example.interior.repository.VariantRepository;
import com.example.interior.repository.VariantSizeRepository;
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

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/product")
public class ProductController {

	private final ProductRepository productRepository;
	private final ProductImageRepository productImageRepository;
	private final VariantRepository variantRepository;
	private final VariantSizeRepository variantSizeRepository;
	private final CategoryRepository categoryRepository;
	private final CartItemRepository cartItemRepository;
	private final CloudinaryService cloudinaryService;

	public ProductController(ProductRepository productRepository, ProductImageRepository productImageRepository, VariantRepository variantRepository, VariantSizeRepository variantSizeRepository, CategoryRepository categoryRepository, CartItemRepository cartItemRepository, CloudinaryService cloudinaryService) {
		this.productRepository = productRepository;
		this.productImageRepository = productImageRepository;
		this.variantRepository = variantRepository;
		this.variantSizeRepository = variantSizeRepository;
		this.categoryRepository = categoryRepository;
		this.cartItemRepository = cartItemRepository;
		this.cloudinaryService = cloudinaryService;
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
		List<Variant> variants = variantRepository.findByProductId(id);
		for (Variant variant : variants) {
			List<VariantSize> sizes = variantSizeRepository.findByVariantId(variant.getId());
			variantSizeRepository.deleteAll(sizes);
		}
		variantRepository.deleteAll(variants);
		productRepository.deleteById(id);
	}

	@PostMapping("/variant/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	@Transactional
	public VariantDto createVariant(@PathVariable Long id, @Valid @RequestPart("data") VariantUpsertRequest request, @RequestPart(value = "image", required = false) MultipartFile image) {
		Product product = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
		Variant variant = new Variant();
		variant.setProduct(product);
		variant.setColor(request.color());
		if (image != null && !image.isEmpty()) {
			var uploaded = cloudinaryService.upload(image, "products/variants");
			variant.setImage(uploaded.url());
			variant.setPublicId(uploaded.publicId());
		}
		variant = variantRepository.save(variant);
		saveVariantSizes(variant, request.sizes());
		return toVariantDto(variantRepository.findById(variant.getId()).orElseThrow());
	}

	@PutMapping("/variant/{productId}/{variantId}")
	@PreAuthorize("hasRole('ADMIN')")
	@Transactional
	public VariantDto updateVariant(@PathVariable Long productId, @PathVariable Long variantId, @Valid @RequestPart("data") VariantUpsertRequest request, @RequestPart(value = "image", required = false) MultipartFile image) {
		Variant variant = variantRepository.findById(variantId).orElseThrow(() -> new IllegalArgumentException("Variant not found: " + variantId));
		Product product = productRepository.findById(productId).orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));
		variant.setProduct(product);
		variant.setColor(request.color());
		if (image != null && !image.isEmpty()) {
			cloudinaryService.delete(variant.getPublicId());
			var uploaded = cloudinaryService.upload(image, "products/variants");
			variant.setImage(uploaded.url());
			variant.setPublicId(uploaded.publicId());
		}
		variant = variantRepository.save(variant);
		variantSizeRepository.deleteAll(variantSizeRepository.findByVariantId(variantId));
		saveVariantSizes(variant, request.sizes());
		return toVariantDto(variantRepository.findById(variant.getId()).orElseThrow());
	}

	@DeleteMapping("/variant/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	@Transactional
	public void deleteVariant(@PathVariable Long id) {
		Variant variant = variantRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Variant not found: " + id));
		cloudinaryService.delete(variant.getPublicId());
		variantSizeRepository.deleteAll(variantSizeRepository.findByVariantId(id));
		variantRepository.delete(variant);
	}

	private void applyProductRequest(Product product, ProductUpsertRequest request) {
		product.setSku(request.sku());
		product.setName(request.name());
		product.setDescription(request.description());
		product.setPrice(request.price());
		product.setQuantity(request.quantity());
		product.setHasVariant(Boolean.TRUE.equals(request.hasVariant()));
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

	private void saveVariantSizes(Variant variant, List<VariantUpsertRequest.VariantSizeInput> inputs) {
		if (inputs == null) {
			return;
		}
		for (VariantUpsertRequest.VariantSizeInput input : inputs) {
			VariantSize size = new VariantSize();
			size.setVariant(variant);
			size.setSize(input.size());
			size.setQuantity(input.quantity());
			size.setPrice(input.price());
			size.setQrCodeUrl(input.qrCodeUrl());
			variantSizeRepository.save(size);
		}
	}

	private ProductDto toDto(Product product) {
		List<Long> imageIds = productImageRepository.findByProductId(product.getId()).stream().map(ProductImage::getId).toList();
		List<Long> variantIds = variantRepository.findByProductId(product.getId()).stream().map(Variant::getId).toList();
		return new ProductDto(product.getId(), product.getSku(), product.getName(), product.getDescription(), product.getPrice(), product.getQuantity(), product.getHasVariant(), product.getQrCodeUrl(), product.getCategory() == null ? null : product.getCategory().getId(), imageIds, variantIds);
	}

	private VariantDto toVariantDto(Variant variant) {
		List<Long> sizeIds = variantSizeRepository.findByVariantId(variant.getId()).stream().map(VariantSize::getId).toList();
		return new VariantDto(variant.getId(), variant.getColor(), variant.getImage(), variant.getPublicId(), variant.getProduct() == null ? null : variant.getProduct().getId(), sizeIds);
	}
}