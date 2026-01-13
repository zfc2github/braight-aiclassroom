package com.braight.dc.admin.web.controller;

import com.braight.master.common.core.domain.model.RegisterBody;
import lombok.Data;

/**
 * @author Shine
 * @date 2025/12/24
 */
@Data
public class RegisterBodyVO extends RegisterBody {
    private String userType; // student, teacher, parent
    private String school;
    private String avatar;
    private String department;
    private String phone;
}
