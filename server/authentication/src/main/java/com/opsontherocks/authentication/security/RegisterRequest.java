package com.opsontherocks.authentication.security;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
}
