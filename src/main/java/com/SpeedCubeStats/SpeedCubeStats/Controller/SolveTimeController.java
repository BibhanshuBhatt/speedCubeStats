package com.SpeedCubeStats.SpeedCubeStats.Controller;

import com.SpeedCubeStats.SpeedCubeStats.Model.SolveTime;
import com.SpeedCubeStats.SpeedCubeStats.Service.SolveTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solves")
@CrossOrigin(origins = "*")
public class SolveTimeController { @Autowired
private SolveTimeService service;

    @PostMapping
    public ResponseEntity<SolveTime> saveSolveTime(@RequestBody SolveTime solveTime) {
        return ResponseEntity.ok(service.saveSolveTime(solveTime));
    }

    @GetMapping
    public ResponseEntity<?> getAllSolveTimes() {
        return ResponseEntity.ok(service.getAllSolveTimes());
    }

    @GetMapping("/recent")
    public ResponseEntity<?> getRecentSolves() {
        return ResponseEntity.ok(service.getRecentSolves());
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getSolveById(@PathVariable Long id) {
        return service.getSolveById(id)
                .map(solve -> ResponseEntity.ok(solve))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/today")
    public ResponseEntity<?> getTodaysSolves() {
        List<SolveTime> todaysSolves = service.getTodaysSolves();
        return ResponseEntity.ok(todaysSolves);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSolveTime(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
