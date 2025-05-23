package com.opsontherocks.wheel_of_life.security;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
}
