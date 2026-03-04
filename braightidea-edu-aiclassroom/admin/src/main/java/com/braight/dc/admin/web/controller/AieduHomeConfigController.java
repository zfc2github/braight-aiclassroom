package com.braight.dc.admin.web.controller;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.braight.dc.admin.web.entity.AieduHomeConfigPO;
import com.braight.dc.admin.web.mapper.AieduHomeConfigPOMapper;
import com.braight.master.common.annotation.Log;
import com.braight.master.common.core.controller.BaseController;
import com.braight.master.common.core.domain.AjaxResult;
import com.braight.master.common.enums.BusinessType;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

/**
 * 首页配置
 *
 * @author Shine
 * @date 2025/12/30
 */
@RestController
public class AieduHomeConfigController extends BaseController {
    @Resource
    private AieduHomeConfigPOMapper aieduHomeConfigPOMapper;


    @Log(title = "首页配置信息", businessType = BusinessType.QUERY)
    @GetMapping("/api/aieduHomeConfig/{id}")
    public AjaxResult getById(@PathVariable Integer id) {
        AieduHomeConfigPO aieduHomeConfigPO = aieduHomeConfigPOMapper.selectByPrimaryKey(id);
        String contentJson = aieduHomeConfigPO.getContentJson();
        if (contentJson != null && contentJson.length() > 0) {
            aieduHomeConfigPO.setHomeConfig(JSONObject.parseObject(contentJson));
        }
        return success(aieduHomeConfigPO);
    }

    @Log(title = "首页配置信息", businessType = BusinessType.UPDATE)
    @PostMapping("/api/aieduHomeConfig/edit")
    public AjaxResult edit(@RequestBody AieduHomeConfigPO aieduHomeConfigPO) {
        JSONObject solutionDetail = aieduHomeConfigPO.getHomeConfig();
        if (solutionDetail != null) {
            aieduHomeConfigPO.setContentJson(JSON.toJSONString(solutionDetail));
        } else {
            aieduHomeConfigPO.setContentJson("");
        }
        int i = aieduHomeConfigPOMapper.updateByPrimaryKey(aieduHomeConfigPO);
        return i > 0 ? success() : error();
    }

}
