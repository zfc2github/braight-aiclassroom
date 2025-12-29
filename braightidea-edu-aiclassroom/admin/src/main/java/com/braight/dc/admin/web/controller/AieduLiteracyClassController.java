package com.braight.dc.admin.web.controller;

import com.braight.dc.admin.web.entity.AieduLiteracyClassPO;
import com.braight.dc.admin.web.mapper.AieduLiteracyClassPOMapper;
import com.braight.master.common.core.controller.BaseController;
import com.braight.master.common.core.domain.AjaxResult;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
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
@CrossOrigin(origins = "*") // todo Shine 测试用，待删除
@RestController
public class AieduLiteracyClassController extends BaseController {
    @Resource
    private AieduLiteracyClassPOMapper aieduLiteracyClassPOMapper;

    @PostMapping("/api/aiLiteracyClass/list")
    public AjaxResult list() {
        List<AieduLiteracyClassPO> all = aieduLiteracyClassPOMapper.selectAll();
        all
                .forEach(po -> {
                    String keyConcepts = po.getKeyConcepts();
                    String keyConceptsEn = po.getKeyConceptsEn();
                    if (StringUtils.hasLength(keyConcepts)) {
                        po.setKeyConceptList(keyConcepts.split(";|；"));
                    } else {
                        po.setKeyConceptList(new String[0]);
                    }
                    if (StringUtils.hasLength(keyConceptsEn)) {
                        po.setKeyConceptEnList(keyConceptsEn.split(";|；"));
                    } else {
                        po.setKeyConceptEnList(new String[0]);
                    }
                });
        return success(all);
    }
}
