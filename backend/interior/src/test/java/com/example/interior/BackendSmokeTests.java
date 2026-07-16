package com.example.interior;

import com.example.interior.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BackendSmokeTests {

	@LocalServerPort
	private int port;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private TestRestTemplate restTemplate;

	@Test
	void signupShouldCreateUserAndReturnToken() throws Exception {
		String email = uniqueEmail();
		ResponseEntity<String> response = restTemplate.postForEntity(
				baseUrl("/api/users/signup"),
				jsonEntity("""
					{
					  "name": "Smoke Test",
					  "email": "%s",
					  "password": "Password123!"
					}
					""".formatted(email)),
				String.class
		);

		assertThat(response.getStatusCode().value()).isEqualTo(200);

		String body = response.getBody();
		assertThat(body).isNotNull();
		JsonNode root = objectMapper.readTree(body);
		assertThat(root.path("accessToken").asText()).isNotBlank();
		assertThat(root.path("user").path("email").asText()).isEqualTo(email);
		assertThat(userRepository.findByEmail(email)).isNotNull();
	}

	@Test
	void signinShouldReturnTokenForExistingUser() throws Exception {
		String email = uniqueEmail();
		restTemplate.postForEntity(
				baseUrl("/api/users/signup"),
				jsonEntity("""
					{
					  "name": "Signin Test",
					  "email": "%s",
					  "password": "Password123!"
					}
					""".formatted(email)),
				String.class
		);

		ResponseEntity<String> response = restTemplate.postForEntity(
				baseUrl("/api/users/signin"),
				jsonEntity("""
					{
					  "email": "%s",
					  "password": "Password123!"
					}
					""".formatted(email)),
				String.class
		);

		assertThat(response.getStatusCode().value()).isEqualTo(200);
		JsonNode root = objectMapper.readTree(response.getBody());
		assertThat(root.path("accessToken").asText()).isNotBlank();
		assertThat(root.path("user").path("email").asText()).isEqualTo(email);
	}

	@Test
	void publicCategoryEndpointShouldRespondWithArray() throws Exception {
		ResponseEntity<String> response = restTemplate.getForEntity(baseUrl("/api/category"), String.class);
		assertThat(response.getStatusCode().value()).isEqualTo(200);
		assertThat(objectMapper.readTree(response.getBody()).isArray()).isTrue();
	}

	private String uniqueEmail() {
		return "smoke-" + UUID.randomUUID() + "@example.com";
	}

	private String baseUrl(String path) {
		return "http://localhost:" + port + path;
	}

	private HttpEntity<String> jsonEntity(String body) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		return new HttpEntity<>(body, headers);
	}
}