package com.notetaking.repository;

import com.notetaking.entity.NoteVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NoteVersionRepository extends JpaRepository<NoteVersion, UUID> {
    List<NoteVersion> findByNoteIdOrderByVersionNumberDesc(UUID noteId);

    Optional<NoteVersion> findTopByNoteIdOrderByVersionNumberDesc(UUID noteId);
}
