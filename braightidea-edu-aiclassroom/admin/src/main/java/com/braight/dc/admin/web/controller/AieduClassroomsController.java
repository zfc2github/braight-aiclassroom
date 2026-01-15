package com.braight.dc.admin.web.controller;

import com.alibaba.fastjson2.JSONObject;
import com.braight.dc.admin.web.entity.AieduClassroomsPO;
import com.braight.dc.admin.web.entity.AieduTeachersPO;
import com.braight.dc.admin.web.mapper.AieduClassroomSessionPOMapper;
import com.braight.dc.admin.web.mapper.AieduClassroomsPOMapper;
import com.braight.dc.admin.web.mapper.AieduTeachersPOMapper;
import com.braight.master.common.annotation.Log;
import com.braight.master.common.annotation.Login;
import com.braight.master.common.core.controller.BaseController;
import com.braight.master.common.core.domain.AjaxResult;
import com.braight.master.common.core.page.PageDomain;
import com.braight.master.common.core.page.TableSupport;
import com.braight.master.common.enums.BusinessType;
import com.braight.master.common.utils.ServletUtils;
import com.braight.master.common.utils.sql.SqlUtil;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.*;

/**
 * 课堂配置表
 *
 * @author Shine
 * @date 2026/1/13
 */
@RestController
@RequestMapping("/api/teacher/classrooms")
public class AieduClassroomsController extends BaseController {

    @Resource
    private AieduTeachersPOMapper aieduTeachersPOMapper;
    @Resource
    private AieduClassroomsPOMapper aieduClassroomsPOMapper;
    @Resource
    private AieduClassroomSessionPOMapper aieduClassroomSessionPOMapper;


    //    @PreAuthorize("@ss.hasPermi('cms:aieduClassrooms:add')")
    @Login
    @Log(title = "课堂配置信息", businessType = BusinessType.INSERT)
    @PostMapping("/add")
    public AjaxResult add(@Validated @RequestBody AieduClassroomsPO po) {
        AieduTeachersPO teacher = aieduTeachersPOMapper.selectByUserId(getUserId());
        po.setTeacherId(teacher.getTeacherId());
        transferFieldObject2JsonString(po);
        Date now = new Date();
        po.setCreatedAt(now);
        po.setUpdatedAt(now);
        aieduClassroomsPOMapper.insert(po);
        return AjaxResult.success(po);
    }

    //    @PreAuthorize("@ss.hasPermi('cms:aieduClassrooms:edit')")
    @Login
    @Log(title = "课堂配置信息", businessType = BusinessType.UPDATE)
    @PostMapping("/{classroomId}/edit")
    public AjaxResult edit(@PathVariable Integer classroomId,
                           @Validated @RequestBody AieduClassroomsPO po) {
        transferFieldObject2JsonString(po);
        po.setClassroomId(classroomId);
        po.setUpdatedAt(new Date());
        return toAjax(aieduClassroomsPOMapper.updateByPrimaryKey(po));
    }

    private void transferFieldObject2JsonString(AieduClassroomsPO po) {
        JSONObject aiTool = po.getAiTool();
        if (!Objects.isNull(aiTool)) {
            po.setAiToolJson(aiTool.toJSONString());
        }
        JSONObject courseware = po.getCourseware();
        if (!Objects.isNull(courseware)) {
            po.setCoursewareJson(courseware.toJSONString());
        }
        JSONObject quizConfig = po.getQuizConfig();
        if (!Objects.isNull(quizConfig)) {
            po.setQuizConfigJson(quizConfig.toJSONString());
        }
    }

    private void transferFieldJsonString2Object(AieduClassroomsPO po) {
        String aiToolJson = po.getAiToolJson();
        if (StringUtils.hasLength(aiToolJson)) {
            po.setAiTool(JSONObject.parseObject(aiToolJson));
        } else {
            po.setAiTool(new JSONObject());
        }
        String coursewareJson = po.getCoursewareJson();
        if (StringUtils.hasLength(coursewareJson)) {
            po.setCourseware(JSONObject.parseObject(coursewareJson));
        } else {
            po.setCourseware(new JSONObject());
        }
        String quizConfigJson = po.getQuizConfigJson();
        if (StringUtils.hasLength(quizConfigJson)) {
            po.setQuizConfig(JSONObject.parseObject(quizConfigJson));
        } else {
            po.setQuizConfig(new JSONObject());
        }
    }


    //    @PreAuthorize("@ss.hasPermi('cms:aieduClassrooms:list')")
    @Login
    @GetMapping("/list")
    public AjaxResult list() {
        List<AieduClassroomsPO> list;
        JSONObject pagination = new JSONObject();
        String pageNumRaw = ServletUtils.getParameter("pageNum");
        PageDomain pageDomain = TableSupport.buildPageRequest();

        String orderBy = SqlUtil.escapeOrderBySql(pageDomain.getOrderBy());
        if (StringUtils.hasLength(orderBy)) {
            PageHelper.orderBy(orderBy);
        }
        if (pageNumRaw == null) {
            list = aieduClassroomsPOMapper.selectAll();
        } else {
            Integer pageNum = pageDomain.getPageNum();
            Integer pageSize = pageDomain.getPageSize();
            pagination.put("pageNum", pageNum);
            pagination.put("pageSize", pageSize);
            Boolean reasonable = pageDomain.getReasonable();
            PageHelper.startPage(pageNum, pageSize).setReasonable(reasonable);
            list = aieduClassroomsPOMapper.selectAll();
            PageInfo<AieduClassroomsPO> pageInfo = new PageInfo<>(list);
            pagination.put("total", pageInfo.getTotal());
            pagination.put("totalPages", pageInfo.getPages());
        }
        list.forEach(this::transferFieldJsonString2Object);
        Map<String, Object> map = new HashMap<>();
        map.put("items", list);
        map.put("pagination", pagination);
        return AjaxResult.success(map);
    }


    //    @PreAuthorize("@ss.hasPermi('cms:aieduClassrooms:list')")
    @Login
    @GetMapping("/featured")
    public AjaxResult featured() {
        List<AieduClassroomsPO> list;
        JSONObject pagination = new JSONObject();
        String pageNumRaw = ServletUtils.getParameter("pageNum");
        PageDomain pageDomain = TableSupport.buildPageRequest();

        String orderBy = SqlUtil.escapeOrderBySql(pageDomain.getOrderBy());
        if (StringUtils.hasLength(orderBy)) {
            PageHelper.orderBy(orderBy);
        }
        if (pageNumRaw == null) {
            list = aieduClassroomsPOMapper.selectListFeatured();
        } else {
            Integer pageNum = pageDomain.getPageNum();
            Integer pageSize = pageDomain.getPageSize();
            pagination.put("pageNum", pageNum);
            pagination.put("pageSize", pageSize);
            Boolean reasonable = pageDomain.getReasonable();
            PageHelper.startPage(pageNum, pageSize).setReasonable(reasonable);
            list = aieduClassroomsPOMapper.selectListFeatured();
            PageInfo<AieduClassroomsPO> pageInfo = new PageInfo<>(list);
            pagination.put("total", pageInfo.getTotal());
            pagination.put("totalPages", pageInfo.getPages());
        }
        list.forEach(this::transferFieldJsonString2Object);
        Map<String, Object> map = new HashMap<>();
        map.put("items", list);
        map.put("pagination", pagination);
        return AjaxResult.success(map);
    }


    //    @PreAuthorize("@ss.hasPermi('cms:aieduClassrooms:remove')")
    @Login
    @Log(title = "课堂配置信息", businessType = BusinessType.DELETE)
    @PostMapping("/{classroomId}/delete")
    public AjaxResult remove(@PathVariable Integer classroomId) {
        int rows = aieduClassroomsPOMapper.deleteByPrimaryKey(classroomId);
        return toAjax(rows);
    }

}

