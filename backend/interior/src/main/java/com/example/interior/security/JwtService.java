package com.example.interior.security;

import com.example.interior.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class JwtService {

	private final String secret;
	private final long expiration;

	public JwtService(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration}") long expiration) {
		this.secret = secret;
		this.expiration = expiration;
	}

	public String generateToken(User user) {
		return Jwts.builder()
				.subject(user.getEmail())
				.claim("roles", List.of(user.getRole().name()))
				.claim("userId", user.getId())
				.issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + expiration))
				.signWith(signingKey(), Jwts.SIG.HS256)
				.compact();
	}

	public String extractSubject(String token) {
		return Jwts.parser()
				.verifyWith(signingKey())
				.build()
				.parseSignedClaims(token)
				.getPayload()
				.getSubject();
	}

	public boolean isValid(String token) {
		try {
			Jwts.parser().verifyWith(signingKey()).build().parseSignedClaims(token);
			return true;
		} catch (Exception ex) {
			return false;
		}
	}

	@SuppressWarnings("unused")
	public Map<String, Object> parseClaims(String token) {
		return Jwts.parser()
				.verifyWith(signingKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}

	private SecretKey signingKey() {
		byte[] keyBytes = secret.length() >= 32
				? secret.getBytes(StandardCharsets.UTF_8)
				: Decoders.BASE64.decode(secret);
		return Keys.hmacShaKeyFor(keyBytes);
	}
}