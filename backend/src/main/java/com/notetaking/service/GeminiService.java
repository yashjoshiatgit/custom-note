package com.notetaking.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private final WebClient webClient;
    private final String apiKey;
    private final ObjectMapper objectMapper;

    public GeminiService(WebClient.Builder webClientBuilder,
            @Value("${gemini.api.key}") String apiKey,
            ObjectMapper objectMapper) {
        this.webClient = webClientBuilder
                .baseUrl("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent")
                .build();
        this.apiKey = apiKey;
        this.objectMapper = objectMapper;
    }

    public String generateCanvasJson(String rawText) {
        String prompt = "Convert the following text into a structured, visual mind-map format. " +
                "Return STRICTLY valid JSON ONLY (no markdown backticks, no markdown formatting at all) containing a top-level object with a 'nodes' array. "
                +
                "Text nodes should look like: {\"id\": \"unique_string\", \"type\": \"text\", \"x\": number, \"y\": number, \"text\": \"Short label\"}. "
                +
                "Arrows between nodes should look like: {\"id\": \"unique_string\", \"type\": \"arrow\", \"from\": \"source_id\", \"to\": \"target_id\"}. "
                +
                "Ensure x and y coordinates are reasonably spaced out (e.g. 100 to 800) so they don't overlap completely on a 2D canvas. "
                +
                "Text: " + rawText;

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(
                Map.of("parts", List.of(
                        Map.of("text", prompt)))));

        // Adding JSON specification via GenerationConfig (optional but good for Gemini)
        requestBody.put("generationConfig", Map.of(
                "responseMimeType", "application/json"));

        try {
            String responseStr = webClient.post()
                    .uri(uriBuilder -> uriBuilder.queryParam("key", apiKey).build())
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = objectMapper.readTree(responseStr);
            JsonNode textNode = root.path("candidates").get(0).path("content").path("parts").get(0).path("text");

            String jsonOutput = textNode.asText();

            // Just in case it returns markdown blocks despite the strict instructions
            if (jsonOutput.startsWith("```json")) {
                jsonOutput = jsonOutput.substring(7, jsonOutput.length() - 3).trim();
            } else if (jsonOutput.startsWith("```")) {
                jsonOutput = jsonOutput.substring(3, jsonOutput.length() - 3).trim();
            }

            // Validate it is parseable JSON before returning
            objectMapper.readTree(jsonOutput);

            return jsonOutput;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate structure using Gemini API", e);
        }
    }
}
