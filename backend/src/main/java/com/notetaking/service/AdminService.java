package com.notetaking.service;

import com.notetaking.entity.Note;
import com.notetaking.entity.User;
import com.notetaking.repository.NoteRepository;
import com.notetaking.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final NoteRepository noteRepository;

    public AdminService(UserRepository userRepository, NoteRepository noteRepository) {
        this.userRepository = userRepository;
        this.noteRepository = noteRepository;
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void toggleUserBlockStatus(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Cannot block another admin, to be safe
        if ("ADMIN".equals(user.getRole().name())) {
            throw new IllegalArgumentException("Cannot block an admin account");
        }

        user.setBlocked(!user.isBlocked());
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    @Transactional
    public void deleteAnyNote(UUID noteId) {
        if (!noteRepository.existsById(noteId)) {
            throw new IllegalArgumentException("Note not found");
        }
        noteRepository.deleteById(noteId);
    }
}
