package com.braight.dc.admin.web.dto;

import lombok.Data;

import java.util.List;

/**
 * @author Shine
 * @date 2026/1/21
 */
@Data
public class QuizResult {
    private Integer score;
    private Integer correctCount;
    private Integer totalQuestions;
    private List<QuestionResult> results;
}
