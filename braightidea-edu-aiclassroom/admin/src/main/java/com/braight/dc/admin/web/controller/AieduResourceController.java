package com.braight.dc.admin.web.controller;

import cn.hutool.core.util.ArrayUtil;
import com.alibaba.fastjson2.JSON;
import com.braight.dc.admin.web.entity.AieduResourcePO;
import com.braight.dc.admin.web.mapper.AieduResourcePOMapper;
import com.braight.master.common.annotation.Log;
import com.braight.master.common.core.controller.BaseController;
import com.braight.master.common.core.domain.AjaxResult;
import com.braight.master.common.core.page.TableDataInfo;
import com.braight.master.common.enums.BusinessType;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * 资源中心
 *
 * @author Shine
 * @date 2025/12/31
 */
@RestController
@RequestMapping("/api/aieduResource")
public class AieduResourceController extends BaseController {

    @Resource
    private AieduResourcePOMapper aieduResourcePOMapper;


//    @PreAuthorize("@ss.hasPermi('cms:aieduResource:list')")
    @GetMapping("/list")
    public TableDataInfo list(AieduResourcePO po)
    {
        startPage();
        List<AieduResourcePO> list = aieduResourcePOMapper.selectAll(po);
        list.forEach(res -> {
            String tag = res.getTag();
            res.setTags(!StringUtils.hasLength(tag) ? new String[0] : JSON.parseArray(tag, String.class).toArray(new String[0]));
            String tagEn = res.getTagEn();
            res.setTagEns(!StringUtils.hasLength(tagEn) ? new String[0] : JSON.parseArray(tagEn, String.class).toArray(new String[0]));
        });
        return getDataTable(list);
    }

//    @PreAuthorize("@ss.hasPermi('cms:aieduResource:query')")
    @GetMapping("/{id}" )
    public AjaxResult getInfo(@PathVariable("id") Integer id)
    {
        AieduResourcePO po = aieduResourcePOMapper.selectByPrimaryKey(id);
        String tag = po.getTag();
        po.setTags(!StringUtils.hasLength(tag) ? new String[0] : JSON.parseArray(tag, String.class).toArray(new String[0]));
        String tagEn = po.getTagEn();
        po.setTagEns(!StringUtils.hasLength(tagEn) ? new String[0] : JSON.parseArray(tagEn, String.class).toArray(new String[0]));
        return AjaxResult.success(po);
    }

//    @PreAuthorize("@ss.hasPermi('cms:aieduResource:add')")
    @Log(title = "资源中心", businessType = BusinessType.INSERT)
    @PostMapping("/add")
    public AjaxResult add(@Validated @RequestBody AieduResourcePO po)
    {
        String[] tags = po.getTags();
        if (ArrayUtil.isEmpty(tags)) {
            po.setTag("[]");
        } else {
            po.setTag(JSON.toJSONString(tags));
        }
        String[] tagEns = po.getTagEns();
        if (ArrayUtil.isEmpty(tagEns)) {
            po.setTagEn("[]");
        } else {
            po.setTagEn(JSON.toJSONString(tagEns));
        }
        Date now = new Date();
        po.setCreatedAt(now);
        po.setUpdatedAt(now);
        return toAjax(aieduResourcePOMapper.insert(po));
    }

//    @PreAuthorize("@ss.hasPermi('cms:aieduResource:edit')")
    @Log(title = "资源中心", businessType = BusinessType.UPDATE)
    @PostMapping("/edit")
    public AjaxResult edit(@Validated @RequestBody AieduResourcePO po)
    {
        String[] tags = po.getTags();
        if (ArrayUtil.isEmpty(tags)) {
            po.setTag("[]");
        } else {
            po.setTag(JSON.toJSONString(tags));
        }
        String[] tagEns = po.getTagEns();
        if (ArrayUtil.isEmpty(tagEns)) {
            po.setTagEn("[]");
        } else {
            po.setTagEn(JSON.toJSONString(tagEns));
        }
        po.setUpdatedAt(new Date());
        return toAjax(aieduResourcePOMapper.updateByPrimaryKey(po));
    }

//    @PreAuthorize("@ss.hasPermi('cms:aieduResource:remove')")
    @Log(title = "资源中心", businessType = BusinessType.DELETE)
    @PostMapping("/delete/{id}")
    public AjaxResult remove(@PathVariable Integer id)
    {
        return toAjax(aieduResourcePOMapper.deleteByPrimaryKey(id));
    }


}

