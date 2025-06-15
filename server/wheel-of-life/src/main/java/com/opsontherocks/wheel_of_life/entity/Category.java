package com.opsontherocks.wheel_of_life.entity;   // ♺ lower-case “entity” is conventional

import jakarta.persistence.*;
import lombok.*;


@Setter
@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PUBLIC) // Required for JPA
@AllArgsConstructor
@RequiredArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @Column(nullable = false)
    private String name;

    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(name = "category_group", nullable = false)
    private CategoryGroup categoryGroup;

    @NonNull
    @Column(name = "user_email", nullable = false)
    private String userEmail;


}
