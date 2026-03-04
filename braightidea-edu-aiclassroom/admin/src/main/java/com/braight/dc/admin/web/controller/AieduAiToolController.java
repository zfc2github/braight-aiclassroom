package com.braight.dc.admin.web.controller;

import com.braight.dc.admin.web.entity.AieduAiToolPO;
import com.braight.dc.admin.web.mapper.AieduAiToolPOMapper;
import com.braight.master.common.annotation.Log;
import com.braight.master.common.annotation.Login;
import com.braight.master.common.core.controller.BaseController;
import com.braight.master.common.core.domain.AjaxResult;
import com.braight.master.common.enums.BusinessType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * AI 工具信息表
 *
 * @author Shine
 * @date 2026/1/14
 */
@RestController
@RequestMapping("/api/aiTools")
public class AieduAiToolController extends BaseController {

    @Resource
    private AieduAiToolPOMapper aieduAiToolPOMapper;


    @Login
    @Log(title = "AI 工具信息", businessType = BusinessType.INSERT)
    @PostMapping("/add")
    public AjaxResult add(@Validated @RequestBody AieduAiToolPO po) {
        Date now = new Date();
        po.setCreatedAt(now);
        po.setUpdatedAt(now);
        aieduAiToolPOMapper.insert(po);
        return AjaxResult.success(po);
    }
    @Login
    @Log(title = "AI 工具信息", businessType = BusinessType.UPDATE)
    @PostMapping("/edit")
    public AjaxResult edit(@Validated @RequestBody AieduAiToolPO po) {
        Date now = new Date();
        po.setUpdatedAt(now);
        aieduAiToolPOMapper.updateByPrimaryKey(po);
        return AjaxResult.success();
    }

    //    @PreAuthorize("@ss.hasPermi('cms:aiTools:list')")
    @Login
    @Log(title = "AI 工具信息", businessType = BusinessType.QUERY)
    @GetMapping("/list")
    public AjaxResult list(@RequestParam(required = false) String category) {
        List<AieduAiToolPO> list = aieduAiToolPOMapper.selectListByCategory(category);
        return AjaxResult.success(list);
    }


}

