package com.braight.dc.admin.web.controller;

import cn.hutool.core.util.ArrayUtil;
import com.alibaba.fastjson2.JSON;
import com.braight.dc.admin.web.entity.AieduInquiryPO;
import com.braight.dc.admin.web.mapper.AieduInquiryPOMapper;
import com.braight.master.common.core.controller.BaseController;
import com.braight.master.common.core.domain.AjaxResult;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * 联系我们-咨询信息
 *
 * @author Shine
 * @date 2025/12/30
 */
@RestController
public class AieduInquiryController extends BaseController {
    @Resource
    private AieduInquiryPOMapper aieduInquiryPOMapper;


    @GetMapping("/api/aieduInquiry/list")
    public AjaxResult list() {
        List<AieduInquiryPO> all = aieduInquiryPOMapper.selectAll();
        all.forEach(aieduInquiryPO -> {
            String interestsJson = aieduInquiryPO.getInterestsJson();
            String teacherInterestsJson = aieduInquiryPO.getTeacherInterestsJson();
            String parentInterestsJson = aieduInquiryPO.getParentInterestsJson();
            if (StringUtils.hasLength(interestsJson)) {
                aieduInquiryPO.setInterests(JSON.parseObject(interestsJson, String[].class));
            } else {
                aieduInquiryPO.setInterests(new String[0]);
            }
            if (StringUtils.hasLength(teacherInterestsJson)) {
                aieduInquiryPO.setTeacherInterests(JSON.parseObject(teacherInterestsJson, String[].class));
            } else {
                aieduInquiryPO.setTeacherInterests(new String[0]);
            }
            if (StringUtils.hasLength(parentInterestsJson)) {
                aieduInquiryPO.setParentInterests(JSON.parseObject(parentInterestsJson, String[].class));
            } else {
                aieduInquiryPO.setParentInterests(new String[0]);
            }
        });
        return success(all);
    }

    @GetMapping("/api/aieduInquiry/{id}")
    public AjaxResult getById(@PathVariable Integer id) {
        AieduInquiryPO aieduInquiryPO = aieduInquiryPOMapper.selectByPrimaryKey(id);
        String interestsJson = aieduInquiryPO.getInterestsJson();
        String teacherInterestsJson = aieduInquiryPO.getTeacherInterestsJson();
        String parentInterestsJson = aieduInquiryPO.getParentInterestsJson();
        if (StringUtils.hasLength(interestsJson)) {
            aieduInquiryPO.setInterests(JSON.parseObject(interestsJson, String[].class));
        } else {
            aieduInquiryPO.setInterests(new String[0]);
        }
        if (StringUtils.hasLength(teacherInterestsJson)) {
            aieduInquiryPO.setTeacherInterests(JSON.parseObject(teacherInterestsJson, String[].class));
        } else {
            aieduInquiryPO.setTeacherInterests(new String[0]);
        }
        if (StringUtils.hasLength(parentInterestsJson)) {
            aieduInquiryPO.setParentInterests(JSON.parseObject(parentInterestsJson, String[].class));
        } else {
            aieduInquiryPO.setParentInterests(new String[0]);
        }
        return success(aieduInquiryPO);
    }

    @PostMapping("/api/aieduInquiry/add")
    public AjaxResult add(@RequestBody AieduInquiryPO aieduInquiryPO) {
        String[] interests = aieduInquiryPO.getInterests();
        String[] teacherInterests = aieduInquiryPO.getTeacherInterests();
        String[] parentInterests = aieduInquiryPO.getParentInterests();
        if (ArrayUtil.isEmpty(interests)) {
            aieduInquiryPO.setInterestsJson("[]");
        } else {
            aieduInquiryPO.setInterestsJson(JSON.toJSONString(interests));
        }
        if (ArrayUtil.isEmpty(teacherInterests)) {
            aieduInquiryPO.setTeacherInterestsJson("[]");
        } else {
            aieduInquiryPO.setTeacherInterestsJson(JSON.toJSONString(teacherInterests));
        }
        if (ArrayUtil.isEmpty(parentInterests)) {
            aieduInquiryPO.setParentInterestsJson("[]");
        } else {
            aieduInquiryPO.setParentInterestsJson(JSON.toJSONString(parentInterests));
        }
        int i = aieduInquiryPOMapper.insert(aieduInquiryPO);
        return i > 0 ? success() : error();
    }

}
