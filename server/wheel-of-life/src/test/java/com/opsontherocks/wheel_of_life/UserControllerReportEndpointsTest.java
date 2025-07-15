package com.opsontherocks.wheel_of_life;
//Unit tests the report-related endpoints of UserController in isolation,
// verifying controller responses and delegation to the ReportService without loading the Spring context.
import com.opsontherocks.wheel_of_life.controller.UserController;
import com.opsontherocks.wheel_of_life.entity.Report;
import com.opsontherocks.wheel_of_life.service.CategoryService;
import com.opsontherocks.wheel_of_life.service.ReportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.mockito.MockitoAnnotations;

public class UserControllerReportEndpointsTest {

    @Mock
    private ReportService reportService;

    @Mock
    private CategoryService categoryService;

    @Mock
    private JdbcTemplate jdbc;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getAllReports_shouldReturnReportsForUser() {
        String email = "test@example.com";
        List<Report> mockReports = List.of(new Report(27, 2025, email));
        when(reportService.getByUserEmail(email)).thenReturn(mockReports);

        ResponseEntity<List<Report>> response = userController.getAllReports(email);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(reportService).getByUserEmail(email);
    }

    @Test
    void getReport_shouldReturnReportIfExists() {
        String email = "test@example.com";
        Report report = new Report(27, 2025, email);
        when(reportService.getByWeekAndYear(email, 27, 2025)).thenReturn(Optional.of(report));

        ResponseEntity<?> response = userController.getReport(2025, 27, email);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(report, response.getBody());
    }

    @Test
    void getReport_shouldReturnNotFoundIfMissing() {
        String email = "test@example.com";
        when(reportService.getByWeekAndYear(email, 27, 2025)).thenReturn(Optional.empty());

        ResponseEntity<?> response = userController.getReport(2025, 27, email);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void addOrUpdateReport_shouldRejectMissingWeekOrYear() {
        Report report = new Report();
        report.setUserEmail("test@example.com");

        ResponseEntity<?> response = userController.addOrUpdateReport(report, "test@example.com");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(((Map<?, ?>) response.getBody()).get("error").toString().contains("Week and year"));
    }

    @Test
    void addOrUpdateReport_shouldSaveValidReport() {
        Report input = new Report(27, 2025, "test@example.com");
        input.setUserEmail("test@example.com");

        when(reportService.addOrUpdate(any(Report.class))).thenReturn(input);

        ResponseEntity<?> response = userController.addOrUpdateReport(input, "test@example.com");

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(input, response.getBody());
    }

    @Test
    void deleteReport_shouldCallServiceAndReturnNoContent() {
        ResponseEntity<Void> response = userController.deleteReport(2025, 27, "test@example.com");

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(reportService).delete("test@example.com", 27, 2025);
    }

    @Test
    void createEmptyReport_shouldCreateIfNotExists() {
        String email = "test@example.com";

        when(reportService.getByWeekAndYear(anyString(), anyInt(), anyInt()))
                .thenReturn(Optional.empty());

        when(reportService.addOrUpdate(any(Report.class)))
                .thenAnswer(invocation -> invocation.getArgument(0)); // return same object

        ResponseEntity<?> response = userController.createEmptyReportForThisWeek(email);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        Report report = (Report) response.getBody();
        assertNotNull(report);
        assertEquals(email, report.getUserEmail());
        assertNotNull(report.getChat());
        assertEquals("Let's reflect on your week. How did it go?", report.getChat().get(0).getMessage());
    }

    @Test
    void createEmptyReport_shouldReturnConflictIfExists() {
        String email = "test@example.com";

        Report existing = new Report(28, 2025, email);
        when(reportService.getByWeekAndYear(anyString(), anyInt(), anyInt()))
                .thenReturn(Optional.of(existing));

        ResponseEntity<?> response = userController.createEmptyReportForThisWeek(email);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertTrue(((Map<?, ?>) response.getBody()).get("error").toString().contains("already exists"));
    }
}
