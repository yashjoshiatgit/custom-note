package com.notetaking.controller;

import com.notetaking.dto.AuthResponse;
import com.notetaking.dto.NoteResponse;
import com.notetaking.entity.Note;
import com.notetaking.entity.User;
import com.notetaking.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<AuthResponse>> getAllUsers() {
        List<AuthResponse> users = adminService.getAllUsers().stream()
                .map(u -> new AuthResponse(u.getId(), u.getName(), u.getEmail(), u.getRole(), "User details fetched"))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PostMapping("/users/{id}/toggle-block")
    public ResponseEntity<String> toggleUserBlockStatus(@PathVariable UUID id) {
        adminService.toggleUserBlockStatus(id);
        return ResponseEntity.ok("User block status updated successfully");
    }

    @GetMapping("/notes")
    public ResponseEntity<List<NoteResponse>> getAllNotes() {
        List<NoteResponse> notes = adminService.getAllNotes().stream()
                .map(this::mapNoteToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(notes);
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<String> deleteNote(@PathVariable UUID id) {
        adminService.deleteAnyNote(id);
        return ResponseEntity.ok("Note deleted successfully by admin");
    }

    // Manual mapping here for speed, MapStruct is also configured in POM
    private NoteResponse mapNoteToResponse(Note note) {
        return new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getOriginalContent(),
                note.getGeneratedContent(),
                note.getCreatedAt(),
                note.getUpdatedAt());
    }
}
