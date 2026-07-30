package com.example.interior.service;

import com.example.interior.dto.response.FacebookUserResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class FacebookService {

    @Value("${facebook.app-id}")
    private String appId;

    @Value("${facebook.app-secret}")
    private String appSecret;

    public FacebookUserResponse getUser(String accessToken) {

        RestTemplate restTemplate = new RestTemplate();

        String url =
                "https://graph.facebook.com/me?fields=id,name,email&access_token="
                        + accessToken;

        return restTemplate.getForObject(url, FacebookUserResponse.class);
    }
}