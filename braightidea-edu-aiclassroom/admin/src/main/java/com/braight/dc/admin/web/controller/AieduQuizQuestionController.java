package com.braight.dc.admin.web.controller;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONArray;
import com.braight.dc.admin.web.entity.AieduQuizQuestionPO;
import com.braight.dc.admin.web.mapper.AieduQuizQuestionPOMapper;
import com.braight.master.common.annotation.Log;
import com.braight.master.common.annotation.Login;
import com.braight.master.common.core.controller.BaseController;
import com.braight.master.common.core.domain.AjaxResult;
import com.braight.master.common.enums.BusinessType;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * 测验题目信息表
 *
 * @author Shine
 * @date 2026/1/14
 */
@RestController
@RequestMapping("/api/quiz/questions")
public class AieduQuizQuestionController extends BaseController {

    @Resource
    private AieduQuizQuestionPOMapper aieduQuizQuestionPOMapper;

    @Login
    @Log(title = "测验题目信息", businessType = BusinessType.INSERT)
    @PostMapping("/add")
    public AjaxResult add(@Validated @RequestBody AieduQuizQuestionPO po) {
        transferFieldObject2JsonString(po);
        Date now = new Date();
        po.setCreatedAt(now);
        po.setUpdatedAt(now);
        if (po.getCustomized() == null) {
            po.setCustomized(false);
        }
        aieduQuizQuestionPOMapper.insert(po);
        return AjaxResult.success(po);
    }
    @Login
    @Log(title = "测验题目信息", businessType = BusinessType.UPDATE)
    @PostMapping("/edit")
    public AjaxResult edit(@Validated @RequestBody AieduQuizQuestionPO po) {
        transferFieldObject2JsonString(po);
        Date now = new Date();
        po.setUpdatedAt(now);
        if (po.getCustomized() == null) {
            po.setCustomized(false);
        }
        aieduQuizQuestionPOMapper.updateByPrimaryKey(po);
        return AjaxResult.success();
    }

    private void transferFieldObject2JsonString(AieduQuizQuestionPO po) {
        JSONArray options = po.getOptions();
        if (!Objects.isNull(options)) {
            po.setOptionsJsonarray(options.toJSONString());
        } else {
            po.setOptionsJsonarray(new JSONArray().toJSONString());
        }
        JSONArray optionsEn = po.getOptionsEn();
        if (!Objects.isNull(optionsEn)) {
            po.setOptionsEnJsonarray(optionsEn.toJSONString());
        } else {
            po.setOptionsEnJsonarray(new JSONArray().toJSONString());
        }
        JSONArray answer = po.getAnswer();
        if (!Objects.isNull(answer)) {
            po.setAnswerJson(JSON.toJSONString(answer));
        } else {
            po.setAnswerJson(new JSONArray().toJSONString());
        }
    }


    /**
     * 获取推荐题目
     */
    //    @PreAuthorize("@ss.hasPermi('cms:aiTools:list')")
    @Login
    @GetMapping("/recommended")
    public AjaxResult recommended(AieduQuizQuestionPO po) {
        List<AieduQuizQuestionPO> list = aieduQuizQuestionPOMapper.selectRecommendedList(po);
        if (CollectionUtils.isEmpty(list)) {
            return AjaxResult.success(Collections.emptyList());
        }
        list.forEach(p -> {
            transferFieldJsonString2Object(p);
            p.setIsSelected(true);
        });
        return AjaxResult.success(list);
    }

    private void transferFieldJsonString2Object(AieduQuizQuestionPO po) {
        String optionsJsonarray = po.getOptionsJsonarray();
        if (StringUtils.hasLength(optionsJsonarray)) {
            po.setOptions(JSON.parseArray(optionsJsonarray));
        } else {
            po.setOptions(new JSONArray());
        }
        String optionsEnJsonarray = po.getOptionsEnJsonarray();
        if (StringUtils.hasLength(optionsEnJsonarray)) {
            po.setOptionsEn(JSON.parseArray(optionsEnJsonarray));
        } else {
            po.setOptionsEn(new JSONArray());
        }
        String answerJson = po.getAnswerJson();
        if (StringUtils.hasLength(answerJson)) {
            po.setAnswer(JSON.parseArray(answerJson));
        } else {
            po.setAnswer(new JSONArray());
        }
    }


    /**
     * 获取系统题库题目
     *
     * @return
     */
    @Login
    @GetMapping("/questionBank")
    public AjaxResult questionBank() {
        List<AieduQuizQuestionPO> list = aieduQuizQuestionPOMapper.selectQuestionBankList();
        if (CollectionUtils.isEmpty(list)) {
            return AjaxResult.success(Collections.emptyList());
        }
        list.forEach(p -> {
            transferFieldJsonString2Object(p);
            p.setIsSelected(false);
        });
        return AjaxResult.success(list);
    }
}

