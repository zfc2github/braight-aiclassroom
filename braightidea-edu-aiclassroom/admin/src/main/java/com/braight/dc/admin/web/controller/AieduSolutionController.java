package com.braight.dc.admin.web.controller;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.braight.dc.admin.web.entity.AieduSolutionPO;
import com.braight.dc.admin.web.mapper.AieduSolutionPOMapper;
import com.braight.master.common.annotation.Log;
import com.braight.master.common.core.controller.BaseController;
import com.braight.master.common.core.domain.AjaxResult;
import com.braight.master.common.enums.BusinessType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * 教育支持-解决方案
 *
 * @author Shine
 * @date 2025/12/29
 */
@RestController
public class AieduSolutionController extends BaseController {
    @Resource
    private AieduSolutionPOMapper aieduSolutionPOMapper;

    @Log(title = "教育支持-解决方案信息列表", businessType = BusinessType.QUERY)
    @GetMapping("/api/aieduSolution/list")
    public AjaxResult list() {
        List<AieduSolutionPO> all = aieduSolutionPOMapper.selectAll();
        return success(all);
    }

    @Log(title = "教育支持-解决方案信息", businessType = BusinessType.QUERY)
    @GetMapping("/api/aieduSolution/{tid}")
    public AjaxResult getSolutionByTid(@PathVariable Integer tid) {
        AieduSolutionPO aieduSolutionPO = aieduSolutionPOMapper.selectByPrimaryKey(tid);
        String contentJson = aieduSolutionPO.getContentJson();
        if (StringUtils.hasLength(contentJson)) {
            aieduSolutionPO.setSolutionDetail(JSON.parseObject(contentJson));
        } else {
            aieduSolutionPO.setSolutionDetail(new JSONObject());
        }
        return success(aieduSolutionPO);
    }

    @Log(title = "教育支持-解决方案信息", businessType = BusinessType.UPDATE)
    @PostMapping("/api/aieduSolution/edit")
    public AjaxResult edit(@RequestBody AieduSolutionPO aieduSolutionPO) {
        JSONObject solutionDetail = aieduSolutionPO.getSolutionDetail();
        if (solutionDetail != null) {
            aieduSolutionPO.setContentJson(JSON.toJSONString(solutionDetail));
        } else {
            aieduSolutionPO.setContentJson("");
        }
        int i = aieduSolutionPOMapper.updateByPrimaryKey(aieduSolutionPO);
        return i > 0 ? success() : error();
    }

}
