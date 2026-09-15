package com.ecotrack.ecotrack.controller;

import com.ecotrack.ecotrack.entity.EcoReport;
import com.ecotrack.ecotrack.service.EcoReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class EcoReportController {

    private final EcoReportService service;

    public EcoReportController(EcoReportService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<EcoReport> createReport(
            @Valid @RequestBody EcoReport report) {

        return new ResponseEntity<>(
                service.createReport(report),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<EcoReport>> getAllReports() {
        return ResponseEntity.ok(service.getAllReports());
    }

    @GetMapping("/search")
    public ResponseEntity<List<EcoReport>> search(
            @RequestParam String location) {

        return ResponseEntity.ok(
                service.searchByLocation(location)
        );
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<EcoReport>> filterCategory(
            @PathVariable String category) {

        return ResponseEntity.ok(
                service.filterByCategory(category)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<EcoReport>> filterStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                service.filterByStatus(status)
        );
    }

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<EcoReport>> filterPriority(
            @PathVariable String priority) {

        return ResponseEntity.ok(
                service.filterByPriority(priority)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<EcoReport> getReportById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getReportById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<EcoReport> updateReport(
            @PathVariable Long id,
            @Valid @RequestBody EcoReport report) {

        return ResponseEntity.ok(
                service.updateReport(id, report)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReport(
            @PathVariable Long id) {

        service.deleteReport(id);

        return ResponseEntity.ok(
                "Report deleted successfully"
        );
    }
}
