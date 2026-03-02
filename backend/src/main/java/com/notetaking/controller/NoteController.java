package com.notetaking.controller;

import com.notetaking.dto.GenerateNoteRequest;
import com.notetaking.dto.NoteRequest;
import com.notetaking.dto.NoteResponse;
import com.notetaking.service.NoteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @PostMapping
    public ResponseEntity<NoteResponse> createNote(@Valid @RequestBody NoteRequest request, Principal principal) {
        NoteResponse response = noteService.createNote(principal.getName(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<NoteResponse>> getUserNotes(Principal principal) {
        List<NoteResponse> notes = noteService.getUserNotes(principal.getName());
        return ResponseEntity.ok(notes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteResponse> getNoteById(@PathVariable UUID id, Principal principal) {
        NoteResponse response = noteService.getNoteById(principal.getName(), id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteResponse> updateNote(@PathVariable UUID id, @Valid @RequestBody NoteRequest request,
            Principal principal) {
        NoteResponse response = noteService.updateNote(principal.getName(), id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/generate")
    public ResponseEntity<NoteResponse> generateNoteContent(@PathVariable UUID id,
            @RequestBody GenerateNoteRequest request, Principal principal) {
        NoteResponse response = noteService.generateNoteContent(principal.getName(), id, request.getRawText());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<com.notetaking.entity.NoteVersion>> getNoteHistory(@PathVariable UUID id,
            Principal principal) {
        return ResponseEntity.ok(noteService.getNoteHistory(principal.getName(), id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNote(@PathVariable UUID id, Principal principal) {
        noteService.deleteNote(principal.getName(), id);
        return ResponseEntity.ok("Note deleted successfully");
    }
}
