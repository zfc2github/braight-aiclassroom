package com.braight.dc.admin.web.controller;

import cn.hutool.core.util.RandomUtil;
import com.alibaba.fastjson2.JSONObject;
import com.braight.dc.admin.web.constants.Constant;
import com.braight.dc.admin.web.dto.ClassroomSessionJoinQuery;
import com.braight.dc.admin.web.dto.ClassroomSessionJoinVO;
import com.braight.dc.admin.web.entity.*;
import com.braight.dc.admin.web.mapper.*;
import com.braight.master.common.annotation.Log;
import com.braight.master.common.annotation.Login;
import com.braight.master.common.core.controller.BaseController;
import com.braight.master.common.core.domain.AjaxResult;
import com.braight.master.common.enums.BusinessType;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * 课堂会话表
 *
 * @author Shine
 * @date 2026/1/15
 */
@RestController
@RequestMapping("/api/classroomSession")
public class AieduClassroomSessionController extends BaseController {

    @Resource
    private AieduTeachersPOMapper aieduTeachersPOMapper;
    @Resource
    private AieduClassroomsPOMapper aieduClassroomsPOMapper;
    @Resource
    private AieduClassroomSessionPOMapper aieduClassroomSessionPOMapper;
    @Resource
    private AieduLiteracyClassPOMapper aieduLiteracyClassPOMapper;
    @Resource
    private AieduClassroomSessionStudentPOMapper aieduClassroomSessionStudentPOMapper;
    @Resource
    private AieduStudentPOMapper aieduStudentPOMapper;


    @Login
    @Log(title = "课堂会话信息", businessType = BusinessType.INSERT)
    @PostMapping("/create")
    public AjaxResult sessionCreate(@Validated @RequestBody AieduClassroomSessionPO po) {
        AieduTeachersPO teacher = aieduTeachersPOMapper.selectByUserId(getUserId());
        po.setTeacherId(teacher.getTeacherId());
        po.setTeacherName(teacher.getName());

        // 重复提交校验
        if (hasActiveSession(po)) {
            return AjaxResult.warn("请勿重复提交");
        }

        AieduClassroomsPO classroomsPO = aieduClassroomsPOMapper.selectByPrimaryKey(po.getClassroomId());
        po.setClassroomId(classroomsPO.getClassroomId());
        po.setClassroomName(classroomsPO.getName());
        String classCode = RandomUtil.randomNumbers(6);
        po.setClassCode(classCode);
        po.setCurrentStage(Constant.ClassroomSessionCurrentStage.WAITING);
        po.setStatus(Constant.ClassroomSessionStatus.ACTIVE);
        po.setGrade(classroomsPO.getGrade());
        po.setAiToolJson(classroomsPO.getAiToolJson());
        po.setCoursewareJson(classroomsPO.getCoursewareJson());
        po.setQuizConfigJson(classroomsPO.getQuizConfigJson());
        Date now = new Date();
        po.setCreatedAt(now);
        po.setUpdatedAt(now);
        aieduClassroomSessionPOMapper.insert(po);

        aieduClassroomsPOMapper.updateLastUsedAt(po.getClassroomId(), now);

        po.setAiTool(getJsonObject(classroomsPO.getAiToolJson()));
        po.setCourseware(getJsonObject(classroomsPO.getCoursewareJson()));
        po.setQuizConfig(getJsonObject(classroomsPO.getQuizConfigJson()));

        // 初始化学生任务信息表数据
        List<AieduStudentPO> students = aieduStudentPOMapper.selectBySessionId(po.getClassId());
        students.forEach(student -> {
            AieduClassroomSessionStudentPO row = new AieduClassroomSessionStudentPO();
            row.setClassroomSessionId(po.getId());
            row.setStudentId(student.getStudentId());
            row.setStudentName(student.getName());
            row.setJoinedAt(null);
            row.setCurrentStage(Constant.ClassroomSessionCurrentStage.WAITING);
            row.setWorkStatus(Constant.ClassroomStatus.WAITING);
            row.setApiCount(0);
            row.setQuizStatus(Constant.ClassroomStatus.WAITING);
            row.setQuizScore(0);
            aieduClassroomSessionStudentPOMapper.insert(row);
        });
        return AjaxResult.success(po);
    }


    /**
     * 获取课堂会话信息（会话状态）
     *
     * @param sessionId
     * @return
     */
    @Login
    @GetMapping("/{sessionId}")
    public AjaxResult getInfo(@PathVariable Integer sessionId) {
        AieduClassroomSessionPO po = aieduClassroomSessionPOMapper.selectByPrimaryKey(sessionId);
        return AjaxResult.success(po);
    }

    @Login
    @Log(title = "课堂会话信息", businessType = BusinessType.UPDATE)
    @PostMapping("/{sessionId}/stage")
    public AjaxResult updateStage(@PathVariable Integer sessionId,
                                  @RequestBody AieduClassroomSessionPO po) {
        if (!StringUtils.hasLength(po.getCurrentStage())) {
            return AjaxResult.warn("参数“当前阶段”不可为空");
        }
        po.setId(sessionId);
        aieduClassroomSessionPOMapper.updateStageStatus(po);
        return AjaxResult.success();
    }

    @Login
    @Log(title = "课堂会话信息", businessType = BusinessType.UPDATE)
    @PostMapping("/{sessionId}/end")
    public AjaxResult endSession(@PathVariable Integer sessionId) {
        AieduClassroomSessionPO po = new AieduClassroomSessionPO();
        po.setId(sessionId);
        po.setCurrentStage(Constant.ClassroomSessionCurrentStage.COMPLETED);
        po.setStatus(Constant.ClassroomSessionStatus.ENDED);
        aieduClassroomSessionPOMapper.updateStageStatus(po);
        return AjaxResult.success();
    }

    @Login
    @GetMapping("/{sessionId}/courseware")
    public AjaxResult getCoursewareInfo(@PathVariable Integer sessionId) {
        AieduClassroomSessionPO po = aieduClassroomSessionPOMapper.selectByPrimaryKey(sessionId);
        AieduClassroomsPO classroomsPO = aieduClassroomsPOMapper.selectByPrimaryKey(po.getClassroomId());
        JSONObject courseware = getJsonObject(classroomsPO.getCoursewareJson());
        String id = courseware.getString("id");
        if (!StringUtils.hasLength(id)) {
            return AjaxResult.error("未查询到课件");
        }
        AieduLiteracyClassPO literacyClassPO = aieduLiteracyClassPOMapper.selectByPrimaryKey(id);
        if (Objects.isNull(literacyClassPO)) {
            return AjaxResult.error("未查询到课件");
        }
        return AjaxResult.success(literacyClassPO);
    }

    private boolean hasActiveSession(AieduClassroomSessionPO po) {
        return aieduClassroomSessionPOMapper.selectActiveSession(po).size() > 0;
    }

    private JSONObject getJsonObject(String jsonString) {
        if (StringUtils.hasLength(jsonString)) {
            return JSONObject.parseObject(jsonString);
        }
        return new JSONObject();
    }

    @Log(title = "加入课堂", businessType = BusinessType.OTHER)
    @PostMapping("/join")
    public AjaxResult joinSession(@Validated @RequestBody ClassroomSessionJoinQuery query) {
        // 校验课堂码是否处于激活状态
        String classCode = query.getClassCode();
        AieduClassroomSessionPO activePo = aieduClassroomSessionPOMapper.selectActiveByClassCode(classCode);
        if (Objects.isNull(activePo)) {
            return AjaxResult.error("课堂码不存在或已失效");
        }
        Integer classroomSessionId = activePo.getId();
        String studentId = query.getStudentId();
        // 校验学号是否已加入
        AieduClassroomSessionStudentPO joinedStudent = aieduClassroomSessionStudentPOMapper.selectJoined(classroomSessionId, studentId);
        if (!Objects.isNull(joinedStudent)) {
            return AjaxResult.error("该学号已加入课堂");
        }

        AieduClassroomSessionStudentPO entity = aieduClassroomSessionStudentPOMapper.selectStudent(classroomSessionId, studentId);
        entity.setJoinedAt(new Date());
        String studentName = query.getStudentName();
        entity.setCurrentStage(Constant.ClassroomSessionCurrentStage.TOOL_EXPERIENCE);
        entity.setWorkStatus(Constant.ClassroomStatus.IN_PROGRESS);
        aieduClassroomSessionStudentPOMapper.updateSelective(entity);

        // 返回课堂信息、学生信息、在线学生数量等
        ClassroomSessionJoinVO vo = new ClassroomSessionJoinVO();
        vo.setSessionId(classroomSessionId);
        vo.setStudentId(studentId);
        vo.setStudentName(studentName);
        vo.setClassCode(classCode);
        vo.setClassroomName(activePo.getClassroomName());
        vo.setCurrentStage(activePo.getCurrentStage());
        vo.setJoinedAt(entity.getJoinedAt());
        vo.setAiTool(getJsonObject(activePo.getAiToolJson()));

        AieduClassroomSessionStudentPO param = new AieduClassroomSessionStudentPO();
        param.setClassroomSessionId(classroomSessionId);
        List<AieduClassroomSessionStudentPO> list = aieduClassroomSessionStudentPOMapper.selectJoinedByEntity(param);
        vo.setOnlineStudentCount(list.size());

        return AjaxResult.success(vo);
    }
}

