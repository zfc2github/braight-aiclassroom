package com.braight.dc.admin.web.dto;

import com.braight.dc.admin.web.entity.AieduClassroomSessionStudentPO;
import lombok.Data;

import java.util.List;

/**
 * @author Shine
 * @date 2026/2/4
 */
@Data
public class SessionData {
  private Integer sessionId;
  private String currentStage;
  private Integer onlineStudentCount;
  private List<AieduClassroomSessionStudentPO> joinedStudents;
  private List<AieduClassroomSessionStudentPO> notJoinedStudents;
}
