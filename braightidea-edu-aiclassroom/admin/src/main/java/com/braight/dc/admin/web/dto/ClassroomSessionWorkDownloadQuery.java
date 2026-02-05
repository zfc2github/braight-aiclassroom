package com.braight.dc.admin.web.dto;

import lombok.Data;

import java.util.List;

/**
 * @author Shine
 * @date 2026/1/20
 */
@Data
public class ClassroomSessionWorkDownloadQuery {
    private List<Integer> ids;
    private String language = "zh";
}
