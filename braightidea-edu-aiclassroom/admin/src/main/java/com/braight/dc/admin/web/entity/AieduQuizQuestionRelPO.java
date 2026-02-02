package com.braight.dc.admin.web.entity;

import lombok.Data;

import java.util.Date;

@Data
public class AieduQuizQuestionRelPO {
    private Integer id;

    private Integer quizQuestionId;

    private Integer aiToolId;
    private String toolId;
    private String source;

    private String coursewareId;

    private Date createdAt;

    private Date updatedAt;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getQuizQuestionId() {
        return quizQuestionId;
    }

    public void setQuizQuestionId(Integer quizQuestionId) {
        this.quizQuestionId = quizQuestionId;
    }

    public Integer getAiToolId() {
        return aiToolId;
    }

    public void setAiToolId(Integer aiToolId) {
        this.aiToolId = aiToolId;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
}
