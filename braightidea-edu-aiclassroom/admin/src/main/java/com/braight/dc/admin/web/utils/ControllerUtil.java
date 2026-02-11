package com.braight.dc.admin.web.utils;

import com.alibaba.fastjson2.JSONObject;
import org.springframework.util.StringUtils;

import java.util.Objects;

public class ControllerUtil {
  public static JSONObject getJsonObject(String jsonString) {
    if (StringUtils.hasLength(jsonString)) {
      return JSONObject.parseObject(jsonString);
    }
    return new JSONObject();
  }

  public static String getJsonString(JSONObject content) {
    return Objects.isNull(content)
            ? new JSONObject().toJSONString()
            : content.toJSONString();
  }
}
