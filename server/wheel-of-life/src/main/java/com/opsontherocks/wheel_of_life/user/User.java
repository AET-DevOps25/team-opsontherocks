package com.opsontherocks.wheel_of_life.user;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class User {

    @Id
    @Column(nullable = false, unique = true)
    private String email;                    // email as unique identifier

    @Column(nullable = false)
    private String password;                 // hashed password

    @Column(nullable = false)
    private String name;                     // display name
}
