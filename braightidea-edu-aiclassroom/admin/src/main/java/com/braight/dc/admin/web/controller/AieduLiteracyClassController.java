package com.braight.dc.admin.web.controller;

import com.braight.dc.admin.web.entity.AieduLiteracyClassPO;
import com.braight.dc.admin.web.mapper.AieduLiteracyClassPOMapper;
import com.braight.master.common.core.controller.BaseController;
import com.braight.master.common.core.domain.AjaxResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

/**
 * AI素养课程
 *
 * @author Shine
 * @date 2025/12/24
 */
@RestController
public class AieduLiteracyClassController extends BaseController {
    @Resource
    private AieduLiteracyClassPOMapper aieduLiteracyClassPOMapper;

    @PostMapping("/aiLiteracyClass/list")
    public AjaxResult list()
    {
        List<AieduLiteracyClassPO> all = aieduLiteracyClassPOMapper.selectAll();
        return success(all);
    }
}
