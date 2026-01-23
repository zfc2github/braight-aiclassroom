package com.braight.dc.admin.web.controller;

import com.alibaba.excel.EasyExcel;
import com.alibaba.fastjson2.JSONObject;
import com.braight.dc.admin.web.entity.AieduClassPO;
import com.braight.dc.admin.web.entity.AieduClassroomSessionPO;
import com.braight.dc.admin.web.entity.AieduStudentPO;
import com.braight.dc.admin.web.entity.AieduTeachersPO;
import com.braight.dc.admin.web.excel.StudentDataListener;
import com.braight.dc.admin.web.mapper.AieduClassPOMapper;
import com.braight.dc.admin.web.mapper.AieduClassroomSessionPOMapper;
import com.braight.dc.admin.web.mapper.AieduStudentPOMapper;
import com.braight.dc.admin.web.mapper.AieduTeachersPOMapper;
import com.braight.master.common.annotation.Log;
import com.braight.master.common.annotation.Login;
import com.braight.master.common.core.controller.BaseController;
import com.braight.master.common.core.domain.AjaxResult;
import com.braight.master.common.core.page.PageDomain;
import com.braight.master.common.core.page.TableDataInfo;
import com.braight.master.common.core.page.TableSupport;
import com.braight.master.common.enums.BusinessType;
import com.braight.master.common.utils.ServletUtils;
import com.braight.master.common.utils.sql.SqlUtil;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.net.URLEncoder;
import java.util.*;

/**
 * 班级信息表
 *
 * @author Shine
 * @date 2026/1/13
 */
@RestController
@RequestMapping("/api/teacher/classes")
public class AieduClassController extends BaseController {

    @Resource
    private AieduClassPOMapper aieduClassPOMapper;
    @Resource
    private AieduStudentPOMapper aieduStudentPOMapper;
    @Resource
    private AieduTeachersPOMapper aieduTeachersPOMapper;
    @Resource
    private AieduClassroomSessionPOMapper aieduClassroomSessionPOMapper;


    //    @PreAuthorize("@ss.hasPermi('cms:aieduClass:add')")
    @Login
    @Log(title = "班级信息", businessType = BusinessType.INSERT)
    @PostMapping("/add")
    public AjaxResult add(@Validated @RequestBody AieduClassPO po) {
        AieduTeachersPO teacher = aieduTeachersPOMapper.selectByUserId(getUserId());
        po.setTeacherId(teacher.getTeacherId());
        po.setStudentCount(0);
        Date now = new Date();
        po.setCreatedAt(now);
        po.setUpdatedAt(now);
        aieduClassPOMapper.insert(po);
        return AjaxResult.success(po);
    }


    //    @PreAuthorize("@ss.hasPermi('cms:aieduClass:list')")
    @Login
    @GetMapping("/list")
    public AjaxResult list() {
        List<AieduClassPO> list;
        JSONObject pagination = new JSONObject();
        String pageNumRaw = ServletUtils.getParameter("pageNum");
        if (pageNumRaw == null) {
            list = aieduClassPOMapper.selectAll();
        } else {
            PageDomain pageDomain = TableSupport.buildPageRequest();
            Integer pageNum = pageDomain.getPageNum();
            Integer pageSize = pageDomain.getPageSize();
            pagination.put("pageNum", pageNum);
            pagination.put("pageSize", pageSize);
            String orderBy = SqlUtil.escapeOrderBySql(pageDomain.getOrderBy());
            Boolean reasonable = pageDomain.getReasonable();
            PageHelper.startPage(pageNum, pageSize, orderBy).setReasonable(reasonable);
            list = aieduClassPOMapper.selectAll();
            PageInfo<AieduClassPO> pageInfo = new PageInfo<>(list);
            pagination.put("total", pageInfo.getTotal());
            pagination.put("totalPages", pageInfo.getPages());
        }
        Map<String, Object> map = new HashMap<>();
        map.put("items", list);
        map.put("pagination", pagination);
        return AjaxResult.success(map);
    }

    /**
     * 获取班级下的学生列表
     * @param classId
     * @param search 搜索关键词（可选，搜索学号或姓名）
     * @return
     */
    @Login
    @GetMapping("/{classId}/students")
    public AjaxResult studentList(@PathVariable Integer classId, @RequestParam(required = false) String search) {
        AieduClassPO classPO = aieduClassPOMapper.selectByPrimaryKey(classId);
        if (classPO == null) {
            return AjaxResult.error("班级不存在");
        }
        List<AieduStudentPO> list;
        JSONObject pagination = new JSONObject();
        String pageNumRaw = ServletUtils.getParameter("pageNum");
        if (pageNumRaw == null) {
            list = aieduStudentPOMapper.selectList(classId, search);
        } else {
            PageDomain pageDomain = TableSupport.buildPageRequest();
            Integer pageNum = pageDomain.getPageNum();
            Integer pageSize = pageDomain.getPageSize();
            pagination.put("pageNum", pageNum);
            pagination.put("pageSize", pageSize);
            String orderBy = SqlUtil.escapeOrderBySql(pageDomain.getOrderBy());
            Boolean reasonable = pageDomain.getReasonable();
            PageHelper.startPage(pageNum, pageSize, orderBy).setReasonable(reasonable);
            list = aieduStudentPOMapper.selectList(classId, search);
            PageInfo<AieduStudentPO> pageInfo = new PageInfo<>(list);
            pagination.put("total", pageInfo.getTotal());
            pagination.put("totalPages", pageInfo.getPages());
        }
        Map<String, Object> map = new HashMap<>();
        map.put("classId", classId);
        map.put("className", classPO.getClassName());
        map.put("items", list);
        map.put("pagination", pagination);
        return AjaxResult.success(map);
    }


    //    @PreAuthorize("@ss.hasPermi('cms:aieduClass:query')")
    @Login
    @GetMapping("/{classId}")
    public AjaxResult getInfo(@PathVariable("classId") Integer classId) {
        AieduClassPO po = aieduClassPOMapper.selectByPrimaryKey(classId);
        return AjaxResult.success(po);
    }

    //    @PreAuthorize("@ss.hasPermi('cms:aieduClass:edit')")
    @Login
    @Log(title = "班级信息", businessType = BusinessType.UPDATE)
    @PostMapping("/edit")
    public AjaxResult edit(@Validated @RequestBody AieduClassPO po) {
        po.setUpdatedAt(new Date());
        return toAjax(aieduClassPOMapper.updateByPrimaryKey(po));
    }

    //    @PreAuthorize("@ss.hasPermi('cms:aieduClass:remove')")
    @Login
    @Log(title = "班级信息", businessType = BusinessType.DELETE)
    @PostMapping("/delete/{classId}")
    public AjaxResult remove(@PathVariable Integer classId) {
        if (hasActiveClassroom(classId)) {
            return AjaxResult.error("班级内有活跃课堂，无法删除");
        }
        int rows = aieduClassPOMapper.deleteByPrimaryKey(classId);
        AjaxResult result = toAjax(rows);
        if (result.isSuccess()) {
            // 同步删除班级下的学生
            aieduStudentPOMapper.deleteByClassId(classId);
        }
        return result;
    }

    private boolean hasActiveClassroom(Integer classId) {
        // 校验逻辑：班级内有活跃课堂，无法删除
        AieduClassroomSessionPO active = aieduClassroomSessionPOMapper.selectActiveByClassId(classId);
        return active != null;
    }

    //    @PreAuthorize("@ss.hasPermi('cms:aieduClass:upload')")
    @Login
    @Log(title = "班级学生信息", businessType = BusinessType.IMPORT)
    @PostMapping("/{classId}/students/import")
    public AjaxResult studentsImport(@PathVariable Integer classId,
                                     @RequestParam("file") MultipartFile file) {
        // 验证班级是否存在
        AieduClassPO classPO = aieduClassPOMapper.selectByPrimaryKey(classId);
        if (classPO == null) {
            return AjaxResult.error("班级不存在");
        }
        if (file.isEmpty()) {
            return AjaxResult.error("请上传文件");
        }
        try {
            // 创建监听器
            StudentDataListener listener = new StudentDataListener(classId, aieduStudentPOMapper);

            // 使用EasyExcel读取文件
            EasyExcel.read(file.getInputStream(), AieduStudentPO.class, listener).sheet().doRead();

            StudentDataListener.ImportResult result = listener.getImportResult();
            // 更新班级学生数量
            aieduClassPOMapper.updateStudentCount(classId);
            return AjaxResult.success(result);
        } catch (Exception e) {
            e.printStackTrace();
            return AjaxResult.error("班级学生信息导入失败：" + e.getMessage());
        }
    }

    @GetMapping("/students/template")
    public void downloadTemplate(HttpServletResponse response) {
        try {
            // 设置响应头
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.setCharacterEncoding("utf-8");

            // 设置下载文件名
            String fileName = "上传学生名单excel模板.xlsx";
            response.setHeader("Content-disposition", "attachment;filename*=utf-8''" +
                    URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20"));

            // 使用 EasyExcel 生成模板文件
            EasyExcel.write(response.getOutputStream(), AieduStudentPO.class)
                    .sheet("学生名单")
                    .doWrite(new ArrayList<>()); // 空数据集，只生成表头
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    /**
     * 根据学号获取学生信息
     *
     * @param studentId
     * @return
     */
    @GetMapping("/students/{studentId}")
    public AjaxResult getStudentInfo(@PathVariable String studentId) {
        AieduStudentPO po = aieduStudentPOMapper.selectByStudentId(studentId);
        return AjaxResult.success(po);
    }
}

