package com.opsontherocks.wheel_of_life.service;

import com.opsontherocks.wheel_of_life.entity.Report;
import com.opsontherocks.wheel_of_life.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    public List<Report> getByUserEmail(String email) {
        return reportRepository.findByUserEmail(email);
    }

    public Optional<Report> getByWeekAndYear(String email, int week, int year) {
        return reportRepository.findByCalendarWeekAndYearAndUserEmail(week, year, email);
    }

    public Report addOrUpdate(Report report) {
        Optional<Report> existing = reportRepository.findByCalendarWeekAndYearAndUserEmail(
                report.getCalendarWeek(), report.getYear(), report.getUserEmail());

        existing.ifPresent(r -> report.setId(r.getId())); // Update if already exists

        return reportRepository.save(report); // Save new or update existing
    }

    public void delete(String email, int week, int year) {
        reportRepository.deleteByCalendarWeekAndYearAndUserEmail(week, year, email);
    }

}
