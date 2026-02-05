package com.braight.dc.admin.web.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

/**
 * @author Shine
 * @date 2026/1/22
 */
@Data
public class StudentWork {
    private String studentId;
    private String studentName;
    private String url;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date submittedAt;
}
