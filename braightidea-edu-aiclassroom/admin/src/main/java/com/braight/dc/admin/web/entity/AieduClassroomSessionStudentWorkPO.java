package com.braight.dc.admin.web.entity;

import com.alibaba.fastjson2.JSONObject;
import com.braight.dc.admin.web.dto.AieduClassroomSessionStudentWork;
import com.braight.dc.admin.web.dto.Views;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.List;

@Data
public class AieduClassroomSessionStudentWorkPO {
    private Integer id;

    @NotNull
    private Integer classroomSessionId;

    @NotBlank
    private String studentId;

    private String studentName;

    @NotBlank
    private String aiToolType;

    private String submissionType;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date submittedAt;

    private String contentJson;
    @NotNull
    private JSONObject content;
    private List<AieduClassroomSessionStudentWork> submissions;

    @JsonView(Views.Backend.class)
    private Boolean finalSubmit = false;

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

    public String getAiToolType() {
        return aiToolType;
    }

    public void setAiToolType(String aiToolType) {
        this.aiToolType = aiToolType;
    }

    public String getSubmissionType() {
        return submissionType;
    }

    public void setSubmissionType(String submissionType) {
        this.submissionType = submissionType;
    }

    public Date getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Date submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getContentJson() {
        return contentJson;
    }

    public void setContentJson(String contentJson) {
        this.contentJson = contentJson;
    }
}
