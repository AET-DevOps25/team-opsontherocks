package com.opsontherocks.wheel_of_life.security;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
