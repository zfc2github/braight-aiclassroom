package com.braight.dc.admin.web.controller;

import com.braight.master.common.core.domain.model.RegisterBody;

/**
 * @author Shine
 * @date 2025/12/24
 */
public class RegisterBodyVO extends RegisterBody {
    private String userType; // student, teacher, admin

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }
}
