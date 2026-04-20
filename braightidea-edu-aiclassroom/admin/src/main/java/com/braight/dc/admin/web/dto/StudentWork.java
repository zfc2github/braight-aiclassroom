package com.braight.dc.admin.web.dto;

import com.alibaba.fastjson2.JSONObject;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * @author Shine
 * @date 2026/1/22
 */
@Data
public class StudentWork {
    private String studentId;
    private String studentName;
    private String submitType;
    private SubmitWork finalAttempt;
    private List<SubmitWork> allAttempts;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date submittedAt;
    private String type; // 媒体类型
    private String url;
    private JSONObject trainingData; // AIGC训练数据

}
