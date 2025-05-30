package com.opsontherocks.authentication.security;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
