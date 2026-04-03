package com.notetaking.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public GeminiService(ChatClient.Builder chatClientBuilder, ObjectMapper objectMapper) {
        this.chatClient = chatClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    public String generateCanvasJson(String rawText) {
        String promptMessage = "Convert the following text into a structured, visual mind-map format. " +
                "Return STRICTLY valid JSON ONLY (no markdown backticks, no markdown formatting at all) containing a top-level object with a 'nodes' array. " +
                "Text nodes should look like: {\"id\": \"unique_string\", \"type\": \"text\", \"x\": number, \"y\": number, \"text\": \"Short label\"}. " +
                "Arrows between nodes should look like: {\"id\": \"unique_string\", \"type\": \"arrow\", \"from\": \"source_id\", \"to\": \"target_id\"}. " +
                "Ensure x and y coordinates are reasonably spaced out (e.g. 100 to 800) so they don't overlap completely on a 2D canvas. " +
                "Text: " + rawText;

        try {
            String responseStr = chatClient.prompt()
                    .user(promptMessage)
                    .call()
                    .content();

            // Just in case it returns markdown blocks despite the strict instructions
            if (responseStr != null && responseStr.startsWith("```json")) {
                responseStr = responseStr.substring(7, responseStr.length() - 3).trim();
            } else if (responseStr != null && responseStr.startsWith("```")) {
                responseStr = responseStr.substring(3, responseStr.length() - 3).trim();
            }

            // Validate it is parseable JSON before returning
            objectMapper.readTree(responseStr);

            return responseStr;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate structure using Gemini API via Spring AI", e);
        }
    }
}
