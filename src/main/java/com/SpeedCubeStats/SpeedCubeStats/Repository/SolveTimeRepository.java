package com.SpeedCubeStats.SpeedCubeStats.Repository;

import com.SpeedCubeStats.SpeedCubeStats.Model.SolveTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SolveTimeRepository extends JpaRepository<SolveTime, Long> {
    List<SolveTime> findTop10ByOrderByTimestampDesc();
//    List<SolveTime> findAllByIdExists();
    @Query("SELECT s FROM SolveTime s WHERE DATE(s.timestamp) = CURRENT DATE ")
    List<SolveTime> findSolvesForToday();
}
