package com.braight.dc.admin.web.dto;

import lombok.Data;

/**
 * @author Shine
 * @date 2026/1/22
 */
@Data
public class QuestionStats {
    private Integer questionId;
    private Integer correctCount;
    private Integer wrongCount;
    private double accuracy;
}
