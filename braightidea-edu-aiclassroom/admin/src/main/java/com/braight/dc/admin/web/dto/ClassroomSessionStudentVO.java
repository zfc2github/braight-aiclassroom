package com.braight.dc.admin.web.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

/**
 * @author Shine
 * @date 2026/2/11
 */
@Data
public class ClassroomSessionStudentVO {
  private Integer id;
  private Integer classroomSessionId;
  private String studentId;
  private String studentName;
  private String workStatus;
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
  private Date submittedAt;
}
