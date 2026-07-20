package com.example.interior.dto.request;

import jakarta.validation.Valid;
import java.util.List;

public record MergeCartRequest(
        @Valid List<MergeCartItemRequest> items
) {
}