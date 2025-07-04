package com.opsontherocks.wheel_of_life.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Sender sender;

    public enum Sender {
        USER,
        AI
    }
}
