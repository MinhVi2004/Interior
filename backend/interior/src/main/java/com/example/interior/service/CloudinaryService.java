package com.example.interior.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.interior.dto.response.UploadResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryService {

	private final String cloudName;
	private final String apiKey;
	private final String apiSecret;

	public CloudinaryService(@Value("${cloudinary.cloud-name:}") String cloudName,
							 @Value("${cloudinary.api-key:}") String apiKey,
							 @Value("${cloudinary.api-secret:}") String apiSecret) {
		this.cloudName = cloudName;
		this.apiKey = apiKey;
		this.apiSecret = apiSecret;
	}

	public UploadResponse upload(MultipartFile file, String folder) {
		if (file == null || file.isEmpty()) {
			throw new IllegalArgumentException("File is required");
		}
		if (isConfigured()) {
			try {
				Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
						"cloud_name", cloudName,
						"api_key", apiKey,
						"api_secret", apiSecret,
						"secure", true
				));
				Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
						"folder", folder,
						"resource_type", "auto"
				));
				return new UploadResponse(String.valueOf(result.get("secure_url")), String.valueOf(result.get("public_id")));
			} catch (IOException ex) {
				throw new IllegalStateException("Failed to upload file", ex);
			}
		}
		try {
			String originalName = file.getOriginalFilename() == null ? "file" : file.getOriginalFilename();
			String extension = originalName.contains(".") ? originalName.substring(originalName.lastIndexOf('.')) : "";
			String publicId = folder + "/" + UUID.randomUUID() + extension;
			Path uploadDir = Path.of("uploads", folder).toAbsolutePath().normalize();
			Files.createDirectories(uploadDir);
			Path targetPath = uploadDir.resolve(Path.of(publicId).getFileName().toString());
			Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
			return new UploadResponse("/uploads/" + publicId.replace('\\', '/'), publicId);
		} catch (IOException ex) {
			throw new IllegalStateException("Failed to store file locally", ex);
		}
	}

	public void delete(String publicId) {
		if (publicId == null || publicId.isBlank()) {
			return;
		}
		if (!isConfigured()) {
			try {
				Path localPath = Path.of("uploads").toAbsolutePath().normalize().resolve(publicId);
				Files.deleteIfExists(localPath);
				return;
			} catch (IOException ex) {
				throw new IllegalStateException("Failed to delete local file", ex);
			}
		}
		try {
			Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
						"cloud_name", cloudName,
						"api_key", apiKey,
						"api_secret", apiSecret,
						"secure", true
			));
			cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "image"));
		} catch (IOException ex) {
			throw new IllegalStateException("Failed to delete file", ex);
		}
	}

	private boolean isConfigured() {
		return !cloudName.isBlank() && !apiKey.isBlank() && !apiSecret.isBlank();
	}
}