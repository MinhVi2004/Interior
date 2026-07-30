package com.example.interior.service;
import com.example.interior.dto.response.GoogleUserResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
@Service
public class GoogleService {

    public GoogleUserResponse getUser(String accessToken) {

        RestTemplate restTemplate = new RestTemplate();

        return restTemplate.getForObject(
                "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken,
                GoogleUserResponse.class
        );
    }
}