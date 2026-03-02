package com.notetaking.service;

import com.notetaking.dto.NoteRequest;
import com.notetaking.dto.NoteResponse;
import com.notetaking.entity.Note;
import com.notetaking.entity.NoteVersion;
import com.notetaking.entity.User;
import com.notetaking.repository.NoteRepository;
import com.notetaking.repository.NoteVersionRepository;
import com.notetaking.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final NoteVersionRepository noteVersionRepository;
    private final UserRepository userRepository;
    private final GeminiService geminiService;

    public NoteService(NoteRepository noteRepository, NoteVersionRepository noteVersionRepository,
            UserRepository userRepository, GeminiService geminiService) {
        this.noteRepository = noteRepository;
        this.noteVersionRepository = noteVersionRepository;
        this.userRepository = userRepository;
        this.geminiService = geminiService;
    }

    @Transactional
    public NoteResponse createNote(String userEmail, NoteRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Note note = Note.builder()
                .title(request.getTitle())
                .originalContent(request.getOriginalContent())
                .generatedContent(request.getGeneratedContent())
                .user(user)
                .build();

        note = noteRepository.save(note);

        if (request.getGeneratedContent() != null) {
            saveNoteVersion(note, request.getGeneratedContent());
        }

        return mapToResponse(note);
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getUserNotes(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return noteRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public NoteResponse getNoteById(String userEmail, UUID noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found"));

        if (!note.getUser().getEmail().equals(userEmail) && !note.getUser().getRole().name().equals("ADMIN")) {
            throw new IllegalArgumentException("Unauthorized to access this note");
        }

        return mapToResponse(note);
    }

    @Transactional
    public NoteResponse updateNote(String userEmail, UUID noteId, NoteRequest request) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found"));

        if (!note.getUser().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("Unauthorized to update this note");
        }

        note.setTitle(request.getTitle());
        if (request.getOriginalContent() != null) {
            note.setOriginalContent(request.getOriginalContent());
        }
        if (request.getGeneratedContent() != null) {
            note.setGeneratedContent(request.getGeneratedContent());
            saveNoteVersion(note, request.getGeneratedContent());
        }

        note = noteRepository.save(note);
        return mapToResponse(note);
    }

    @Transactional
    public NoteResponse generateNoteContent(String userEmail, UUID noteId, String rawText) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found"));

        if (!note.getUser().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("Unauthorized to generate content for this note");
        }

        String generatedJson = geminiService.generateCanvasJson(rawText);

        note.setOriginalContent(rawText);
        note.setGeneratedContent(generatedJson);

        note = noteRepository.save(note);
        saveNoteVersion(note, generatedJson);

        return mapToResponse(note);
    }

    @Transactional(readOnly = true)
    public List<NoteVersion> getNoteHistory(String userEmail, UUID noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found"));

        if (!note.getUser().getEmail().equals(userEmail) && !note.getUser().getRole().name().equals("ADMIN")) {
            throw new IllegalArgumentException("Unauthorized to view history for this note");
        }

        return noteVersionRepository.findByNoteIdOrderByVersionNumberDesc(noteId);
    }

    @Transactional
    public void deleteNote(String userEmail, UUID noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new IllegalArgumentException("Note not found"));

        if (!note.getUser().getEmail().equals(userEmail) && !note.getUser().getRole().name().equals("ADMIN")) {
            throw new IllegalArgumentException("Unauthorized to delete this note");
        }

        noteRepository.delete(note);
    }

    private void saveNoteVersion(Note note, String canvasState) {
        int nextVersion = noteVersionRepository.findTopByNoteIdOrderByVersionNumberDesc(note.getId())
                .map(v -> v.getVersionNumber() + 1)
                .orElse(1);

        NoteVersion version = NoteVersion.builder()
                .note(note)
                .versionNumber(nextVersion)
                .canvasState(canvasState)
                .build();

        noteVersionRepository.save(version);
    }

    private NoteResponse mapToResponse(Note note) {
        return new NoteResponse(
                note.getId(),
                note.getTitle(),
                note.getOriginalContent(),
                note.getGeneratedContent(),
                note.getCreatedAt(),
                note.getUpdatedAt());
    }
}
