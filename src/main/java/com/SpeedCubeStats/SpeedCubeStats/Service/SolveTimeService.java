package com.SpeedCubeStats.SpeedCubeStats.Service;

import com.SpeedCubeStats.SpeedCubeStats.Model.SolveTime;
import com.SpeedCubeStats.SpeedCubeStats.Repository.SolveTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
public class SolveTimeService {
    @Autowired
    private SolveTimeRepository repository;

    public SolveTime saveSolveTime(SolveTime solveTime) {
        return repository.save(solveTime);
    }

    public List<SolveTime> getAllSolveTimes() {
        return repository.findAll();
    }

    public List<SolveTime> getRecentSolves() {
        return repository.findTop10ByOrderByTimestampDesc();
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public Optional<SolveTime> getSolveById(Long id) {
        return repository.findById(id);
    }

    public List<SolveTime> getTodaysSolves() {
        return repository.findSolvesForToday();
    }
}
