package com.braight.dc.admin.web.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * @author Shine
 * @date 2026/1/19
 */
@Data
public class ClassroomSessionJoinQuery {
    @NotBlank
    private String classCode; // 课堂码
    @NotBlank
    private String studentId; // 学号
    @NotBlank
    private String studentName; // 姓名
}
