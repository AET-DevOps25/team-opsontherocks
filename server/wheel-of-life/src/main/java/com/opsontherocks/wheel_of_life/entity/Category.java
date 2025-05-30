package com.opsontherocks.wheel_of_life.entity;   // ♺ lower-case “entity” is conventional

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "category_group", nullable = false)
    private CategoryGroup categoryGroup;
}
