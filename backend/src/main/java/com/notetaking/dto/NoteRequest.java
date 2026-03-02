package com.notetaking.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NoteRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String originalContent;

    private String generatedContent; // Only used when updating canvas state
}
