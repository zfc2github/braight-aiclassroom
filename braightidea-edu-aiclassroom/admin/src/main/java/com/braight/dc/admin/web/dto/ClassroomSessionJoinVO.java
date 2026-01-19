package com.braight.dc.admin.web.dto;

import com.alibaba.fastjson2.JSONObject;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

/**
 * @author Shine
 * @date 2026/1/19
 */
@Data
public class ClassroomSessionJoinVO {
    private Integer sessionId;
    private String studentId;
    private String studentName;
    private String classCode;
    private String classroomName;
    private JSONObject aiTool;
    private String currentStage;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date joinedAt;
    private Integer onlineStudentCount;
}
