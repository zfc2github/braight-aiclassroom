package com.braight.dc.admin.web.dto;

import lombok.Data;

import java.util.List;

/**
 * @author Shine
 * @date 2026/1/21
 */
@Data
public class ApiInvokeStats {
    private Integer classroomSessionId;
    private int avgCalls; // 平均调用次数
    private List<String> xAxis; // 学生名称
    private List<Integer> seriesData; // 学生调用次数
}
