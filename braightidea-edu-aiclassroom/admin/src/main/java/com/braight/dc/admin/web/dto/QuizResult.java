package com.braight.dc.admin.web.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * @author Shine
 * @date 2026/1/21
 */
@Data
public class QuizResult {
    private String studentId;
    private String studentName;
    private Integer score;
    private Integer answeredCount;
    private Integer correctCount;
    private Integer totalQuestions;
    private List<QuestionResult> results;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date submittedAt;
}
