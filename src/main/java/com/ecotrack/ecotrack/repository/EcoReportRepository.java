package com.ecotrack.ecotrack.repository;

import com.ecotrack.ecotrack.entity.EcoReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EcoReportRepository extends JpaRepository<EcoReport, Long> {

    List<EcoReport> findByCategoryIgnoreCase(String category);

    List<EcoReport> findByStatusIgnoreCase(String status);

    List<EcoReport> findByPriorityIgnoreCase(String priority);

    List<EcoReport> findByLocationContainingIgnoreCase(String location);
}