package com.example.interior.dto.response;

import lombok.Data;

@Data
public class GoogleUserResponse {

    private String sub;
    private String name;
    private String email;
    private Boolean email_verified;
}
