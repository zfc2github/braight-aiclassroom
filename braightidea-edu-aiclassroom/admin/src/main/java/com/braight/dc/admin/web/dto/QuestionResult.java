package com.braight.dc.admin.web.dto;

import lombok.Data;

/**
 * @author Shine
 * @date 2026/1/21
 */
@Data
public class QuestionResult {
    private Integer questionId;
    private String type;
    private Boolean isCorrect;
    private Object correctAnswer;
    private Object studentAnswer;
}
