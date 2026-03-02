package com.notetaking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NoteResponse {
    private UUID id;
    private String title;
    private String originalContent;
    private String generatedContent;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
