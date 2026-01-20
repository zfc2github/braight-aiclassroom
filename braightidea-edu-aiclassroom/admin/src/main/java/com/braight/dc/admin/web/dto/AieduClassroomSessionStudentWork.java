package com.braight.dc.admin.web.dto;

import com.alibaba.fastjson2.JSONObject;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

/**
 * @author Shine
 * @date 2026/1/20
 */
@Data
public class AieduClassroomSessionStudentWork {
    private JSONObject content;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date submittedAt;
}
