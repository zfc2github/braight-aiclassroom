package com.braight.dc.admin.web.controller;

import com.braight.master.common.annotation.Log;
import com.braight.master.common.config.DataVizConfig;
import com.braight.master.common.core.controller.BaseController;
import com.braight.master.common.core.domain.AjaxResult;
import com.braight.master.common.enums.BusinessType;
import com.braight.master.common.utils.file.FileUploadUtils;
import com.braight.master.common.utils.file.FileUtils;
import com.braight.master.framework.config.ServerConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author Shine
 * @date 2026/2/4
 */
@RestController
@RequestMapping("/api/common")
public class ApiCommonController extends BaseController {
  @Autowired
  private ServerConfig serverConfig;

  /**
   * 通用上传请求（单个）
   */
  @Log(title = "通用文件上传", businessType = BusinessType.OTHER)
  @PostMapping("/upload")
  public AjaxResult uploadFile(MultipartFile file) throws Exception
  {
    try
    {
      // 上传文件路径
      String filePath = DataVizConfig.getUploadPath();
      // 上传并返回新文件名称
      String fileName = FileUploadUtils.upload(filePath, file);
      String url = serverConfig.getUrl() + fileName;
      AjaxResult ajax = AjaxResult.success();
      ajax.put("url", url);
      ajax.put("fileName", fileName);
      ajax.put("newFileName", FileUtils.getName(fileName));
      ajax.put("originalFilename", file.getOriginalFilename());
      return ajax;
    }
    catch (Exception e)
    {
      return AjaxResult.error(e.getMessage());
    }
  }

}
