package com.braight.dc.admin.web.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

/**
 * @author Shine
 * @date 2026/1/21
 */
@Data
public class QuizStats {
    private Integer classroomSessionId;
    private int totalStudents;
    private int submitted;
    private int notSubmitted;
    private double averageScore;
    private Map<String, Integer> scoreDistribution;
    private List<QuestionStats> questionStats;
}
