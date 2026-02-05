package com.braight.dc.admin.web.dto;

import com.alibaba.fastjson2.JSONArray;
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
    private JSONArray correctAnswer;
    private JSONArray studentAnswer;
}
