package com.opsontherocks.wheel_of_life;

//Unit tests the core business logic in the ReportService, including retrieval,
// creation, update, and deletion of weekly reports.
import com.opsontherocks.wheel_of_life.entity.Report;
import com.opsontherocks.wheel_of_life.repository.ReportRepository;
import com.opsontherocks.wheel_of_life.service.ReportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ReportServiceTest {

    private ReportService reportService;
    private ReportRepository reportRepository;

    @BeforeEach
    void setUp() {
        reportRepository = mock(ReportRepository.class);
        reportService = new ReportService(reportRepository);
    }

    @Test
    void testGetByUserEmail() {
        String email = "test@example.com";
        List<Report> mockReports = List.of(
                new Report(27, 2025, email),
                new Report(28, 2025, email)
        );

        when(reportRepository.findByUserEmail(email)).thenReturn(mockReports);

        List<Report> result = reportService.getByUserEmail(email);

        assertEquals(2, result.size());
        verify(reportRepository).findByUserEmail(email);
    }

    @Test
    void testGetByWeekAndYear() {
        String email = "test@example.com";
        Report report = new Report(27, 2025, email);

        when(reportRepository.findByCalendarWeekAndYearAndUserEmail(27, 2025, email))
                .thenReturn(Optional.of(report));

        Optional<Report> result = reportService.getByWeekAndYear(email, 27, 2025);

        assertTrue(result.isPresent());
        assertEquals(27, result.get().getCalendarWeek());
        verify(reportRepository).findByCalendarWeekAndYearAndUserEmail(27, 2025, email);
    }

    @Test
    void testAddOrUpdate_NewReport() {
        String email = "test@example.com";
        Report report = new Report(27, 2025, email);

        when(reportRepository.findByCalendarWeekAndYearAndUserEmail(27, 2025, email))
                .thenReturn(Optional.empty());

        when(reportRepository.save(report)).thenReturn(report);

        Report saved = reportService.addOrUpdate(report);

        assertNotNull(saved);
        verify(reportRepository).save(report);
    }

    @Test
    void testAddOrUpdate_UpdateExisting() {
        String email = "test@example.com";
        Report existing = new Report(27, 2025, email);
        existing.setId(42L);
        Report input = new Report(27, 2025, email);

        when(reportRepository.findByCalendarWeekAndYearAndUserEmail(27, 2025, email))
                .thenReturn(Optional.of(existing));
        when(reportRepository.save(any(Report.class))).thenReturn(existing);

        Report updated = reportService.addOrUpdate(input);

        assertEquals(42L, updated.getId());
        verify(reportRepository).save(any(Report.class));
    }

    @Test
    void testDelete() {
        reportService.delete("test@example.com", 27, 2025);
        verify(reportRepository).deleteByCalendarWeekAndYearAndUserEmail(27, 2025, "test@example.com");
    }
}
