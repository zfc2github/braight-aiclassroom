package com.braight.dc.admin.web.entity;

import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.util.Date;

@Data
public class AieduClassroomSessionStudentPO {
    private Integer id;

    private Integer classroomSessionId;

    @NotBlank
    private String studentId;

    private String studentName;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date joinedAt;

    private String workStatus;

    private Integer apiCount;

    private String quizStatus;

    private String quizAnswersJsonarray;
    private JSONArray quizAnswers;
    private JSONObject quizResult;
    private String quizResultJsonobject;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date submittedAt;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getClassroomSessionId() {
        return classroomSessionId;
    }

    public void setClassroomSessionId(Integer classroomSessionId) {
        this.classroomSessionId = classroomSessionId;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Date getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Date joinedAt) {
        this.joinedAt = joinedAt;
    }

    public String getWorkStatus() {
        return workStatus;
    }

    public void setWorkStatus(String workStatus) {
        this.workStatus = workStatus;
    }

    public Integer getApiCount() {
        return apiCount;
    }

    public void setApiCount(Integer apiCount) {
        this.apiCount = apiCount;
    }

    public String getQuizStatus() {
        return quizStatus;
    }

    public void setQuizStatus(String quizStatus) {
        this.quizStatus = quizStatus;
    }

}
