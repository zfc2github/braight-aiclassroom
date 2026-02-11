package com.braight.dc.admin.web.dto;

import com.alibaba.fastjson2.JSONObject;
import com.braight.dc.admin.web.entity.AieduClassroomSessionStudentPO;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;
import java.util.List;

/**
 * @author Shine
 * @date 2026/2/4
 */
@Data
public class SessionData {
  private Integer sessionId;
  private String currentStage;
  private JSONObject quizConfig;
  private Integer totalStudentCount;
  private Integer onlineStudentCount;
//  private List<ClassroomSessionStudentVO> joinedStudents;
  private Integer joined;
  private List<ClassroomSessionStudentVO> notJoinedStudents;
  private List<ClassroomSessionStudentVO> notStartedStudents; // 未开始任务的学生（not joined and work_status is not waiting）
  private Integer started; // 开始任务的学生数量
  private Integer submitted; // 完成任务的学生数量
  private List<ClassroomSessionStudentVO> allStudents; // 排序后的所有学生：(work_status = 'completed', submittedAt asc) + others
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
  private Date lastUpdated;
  private ApiInvokeStats apiInvokeStats;
  private Boolean quizPublished;
  private Integer quizStarted;
  private Integer quizCompleted;
  private List<StudentQuizScore> quizScores;
  private Integer quizAverageScore;

  private List<StudentWork> artifacts;
}
