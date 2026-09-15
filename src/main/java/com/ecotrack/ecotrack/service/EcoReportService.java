package com.ecotrack.ecotrack.service;

import com.ecotrack.ecotrack.entity.EcoReport;
import com.ecotrack.ecotrack.exception.ResourceNotFoundException;
import com.ecotrack.ecotrack.repository.EcoReportRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EcoReportService {

    private final EcoReportRepository repository;

    public EcoReportService(EcoReportRepository repository) {
        this.repository = repository;
    }

    public EcoReport createReport(EcoReport report) {
        report.setCreatedAt(LocalDateTime.now());

        if (report.getStatus() == null || report.getStatus().isBlank()) {
            report.setStatus("Pending");
        }

        return repository.save(report);
    }

    public List<EcoReport> getAllReports() {
        return repository.findAll();
    }

    public EcoReport getReportById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Report not found with id: " + id
                        ));
    }

    public EcoReport updateReport(Long id, EcoReport updatedReport) {

        EcoReport existingReport = getReportById(id);

        existingReport.setReporterName(updatedReport.getReporterName());
        existingReport.setLocation(updatedReport.getLocation());
        existingReport.setCategory(updatedReport.getCategory());
        existingReport.setDescription(updatedReport.getDescription());
        existingReport.setPriority(updatedReport.getPriority());
        existingReport.setStatus(updatedReport.getStatus());

        return repository.save(existingReport);
    }

    public void deleteReport(Long id) {
        EcoReport report = getReportById(id);
        repository.delete(report);
    }

    public List<EcoReport> searchByLocation(String location) {
        return repository.findByLocationContainingIgnoreCase(location);
    }

    public List<EcoReport> filterByCategory(String category) {
        return repository.findByCategoryIgnoreCase(category);
    }

    public List<EcoReport> filterByStatus(String status) {
        return repository.findByStatusIgnoreCase(status);
    }

    public List<EcoReport> filterByPriority(String priority) {
        return repository.findByPriorityIgnoreCase(priority);
    }
}