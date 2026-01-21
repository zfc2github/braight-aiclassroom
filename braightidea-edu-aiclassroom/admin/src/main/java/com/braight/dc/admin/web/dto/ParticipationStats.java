package com.braight.dc.admin.web.dto;

import com.braight.dc.admin.web.entity.AieduClassroomSessionStudentPO;
import lombok.Data;

import java.util.List;

/**
 * @author Shine
 * @date 2026/1/21
 */
@Data
public class ParticipationStats {
    private Integer classroomSessionId;
    private int total;
    private int joined;
    private int inProgress;
    private int completed;
    private List<AieduClassroomSessionStudentPO> notJoinedStudents; // 未加入课堂的学生
    private List<AieduClassroomSessionStudentPO> waitingStudents; // 未开始任务的学生
    private List<AieduClassroomSessionStudentPO> allStudents;
}
