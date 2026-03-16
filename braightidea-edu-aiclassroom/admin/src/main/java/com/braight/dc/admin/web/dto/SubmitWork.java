package com.braight.dc.admin.web.dto;

import com.alibaba.fastjson2.JSONObject;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.util.Date;

/**
 * @author Shine
 * @date 2026/3/13
 */
@Data
public class SubmitWork {
  private Integer id;
  private JSONObject content;
  @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
  private Date submittedAt;
}
