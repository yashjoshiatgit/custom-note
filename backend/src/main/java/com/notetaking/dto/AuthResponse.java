package com.notetaking.dto;

import com.notetaking.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.UUID;

@Data
@AllArgsConstructor
public class AuthResponse {
    private UUID id;
    private String name;
    private String email;
    private Role role;
    private String message;
}
