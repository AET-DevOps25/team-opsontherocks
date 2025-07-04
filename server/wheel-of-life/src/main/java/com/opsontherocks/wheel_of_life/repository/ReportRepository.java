package com.opsontherocks.wheel_of_life.repository;

import com.opsontherocks.wheel_of_life.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByUserEmail(String userEmail);

    Optional<Report> findByCalendarWeekAndYearAndUserEmail(Integer calendarWeek, Integer year, String userEmail);

    void deleteByCalendarWeekAndYearAndUserEmail(Integer calendarWeek, Integer year, String userEmail);
}
