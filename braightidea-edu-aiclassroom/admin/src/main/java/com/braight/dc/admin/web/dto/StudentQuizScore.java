package com.braight.dc.admin.web.dto;

import com.alibaba.excel.annotation.ExcelProperty;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

/**
 * @author Shine
 * @date 2026/2/5
 */
@Data
public class StudentQuizScore {
  private String studentId;
  private String studentName;
  private Integer score;
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
  private Date submittedAt;
}
