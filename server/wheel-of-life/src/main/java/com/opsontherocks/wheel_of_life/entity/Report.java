package com.opsontherocks.wheel_of_life.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"calendar_week", "year", "user_email"}))
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    @Column(name = "calendar_week", nullable = false)
    private Integer calendarWeek;

    @NonNull
    @Column(nullable = false)
    private Integer year;

    @NonNull
    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ElementCollection
    @CollectionTable(name = "report_scores", joinColumns = @JoinColumn(name = "report_id"))
    @MapKeyColumn(name = "category_name")
    @Column(name = "score")
    private Map<String, Float> scores;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "report_id")
    private List<ChatMessage> chat;
}

/*
Example:

{
  "calendarWeek": 27,
  "year": 2025,
  "notes": "This week was intense but productive.",
  "scores": {
    "Finances": 7.5,
    "Mental Health": 6.0
  },
  "chat": [
    {
      "message": "How are you feeling about this week?",
      "sender": "AI"
    },
    {
      "message": "Pretty good, made some progress on goals.",
      "sender": "USER"
    }
  ]
}

 */