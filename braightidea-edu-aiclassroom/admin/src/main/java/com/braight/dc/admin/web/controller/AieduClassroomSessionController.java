package com.braight.dc.admin.web.controller;

import cn.hutool.core.util.RandomUtil;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.braight.dc.admin.web.constants.Constant;
import com.braight.dc.admin.web.dto.*;
import com.braight.dc.admin.web.entity.*;
import com.braight.dc.admin.web.mapper.*;
import com.braight.dc.admin.websocket.WsService;
import com.braight.master.common.annotation.Log;
import com.braight.master.common.annotation.Login;
import com.braight.master.common.core.controller.BaseController;
import com.braight.master.common.core.domain.AjaxResult;
import com.braight.master.common.core.page.PageDomain;
import com.braight.master.common.core.page.TableSupport;
import com.braight.master.common.enums.BusinessType;
import com.braight.master.common.utils.sql.SqlUtil;
import com.fasterxml.jackson.annotation.JsonView;
import com.github.pagehelper.PageHelper;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.*;
import java.util.stream.Collectors;

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
    @Resource
    private WsService wsService;
    @Resource
    private AieduClassroomSessionStudentWorkPOMapper aieduClassroomSessionStudentWorkPOMapper;


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
        // 推送websocket消息
        wsService.endClassroomSession(sessionId);
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

    /**
     * 加入课堂
     *
     * @param query
     * @return
     */
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
        aieduClassroomSessionStudentPOMapper.updateSelective(entity);

        // 返回课堂信息、学生信息、在线学生数量等
        ClassroomSessionJoinVO vo = new ClassroomSessionJoinVO();
        vo.setSessionId(classroomSessionId);
        vo.setStudentId(studentId);
        vo.setStudentName(query.getStudentName());
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


    /**
     * 获取加入课堂的学生列表
     *
     * @param sessionId
     * @return
     */
    @Login
    @GetMapping("/{sessionId}/students")
    public AjaxResult getStudents(@PathVariable String sessionId) {
        List<AieduClassroomSessionStudentPO> students = aieduClassroomSessionStudentPOMapper.selectStudentsByClassroomSessionId(sessionId);
        return AjaxResult.success(students);
    }

    /**
     * 开始学生实验
     *
     * @param sessionId
     * @return
     */
    @Login
    @GetMapping("/{sessionId}/startToolExperience")
    public AjaxResult startToolExperience(@PathVariable Integer sessionId) {
        // 更新当前阶段
        AieduClassroomSessionPO session = aieduClassroomSessionPOMapper.selectByPrimaryKey(sessionId);
        aieduClassroomSessionPOMapper.updateCurrentStage(session.getClassroomId(), Constant.ClassroomSessionCurrentStage.TOOL_EXPERIENCE);
        // 更新作业状态
        aieduClassroomSessionStudentPOMapper.updateWorkStatusByClassroomSessionId(sessionId, Constant.ClassroomStatus.IN_PROGRESS);
        // 发送websocket消息
        wsService.startToolExperience(sessionId);
        return AjaxResult.success();
    }

    /**
     * 开始测验
     *
     * @param sessionId
     * @return
     */
    @Login
    @GetMapping("/{sessionId}/startQuiz")
    public AjaxResult startQuiz(@PathVariable Integer sessionId) {
        // 更新当前阶段
        AieduClassroomSessionPO session = aieduClassroomSessionPOMapper.selectByPrimaryKey(sessionId);
        aieduClassroomSessionPOMapper.updateCurrentStage(session.getClassroomId(), Constant.ClassroomSessionCurrentStage.QUIZ);
        // 更新测验状态
        aieduClassroomSessionStudentPOMapper.updateQuizStatusByClassroomSessionId(sessionId, Constant.ClassroomStatus.IN_PROGRESS);
        // 发送websocket消息
        wsService.publishQuiz(sessionId);
        return AjaxResult.success();
    }

    /**
     * 学生提交作品
     *
     * @param po
     * @return
     */
    @PostMapping("/submitWork")
    public AjaxResult submitWork(@Validated @RequestBody AieduClassroomSessionStudentWorkPO po) {
        // todo Shine 是否限制提交次数
        po.setContentJson(getJsonString(po.getContent()));
        po.setSubmittedAt(new Date());
        aieduClassroomSessionStudentWorkPOMapper.insert(po);
        return AjaxResult.success();
    }

    /**
     * API调用记数（调用一次+1）
     * @param sessionId
     * @param studentId
     * @return
     */
    @GetMapping("/{sessionId}/apiInvokeCounter")
    public AjaxResult apiInvokeCounter(@PathVariable Integer sessionId,
                                     @RequestParam String studentId) {
        AieduClassroomSessionStudentPO sessionStudentPO = aieduClassroomSessionStudentPOMapper.selectStudent(sessionId, studentId);
        int apiCount = sessionStudentPO.getApiCount() == null
                ? 1
                : sessionStudentPO.getApiCount() + 1;
        aieduClassroomSessionStudentPOMapper.updateApiCount(sessionStudentPO.getId(), apiCount);
        return AjaxResult.success();
    }

    private String getJsonString(JSONObject content) {
        return Objects.isNull(content)
                ? new JSONObject().toJSONString()
                : content.toJSONString();
    }

    /**
     * 获取学生作品列表
     *
     * @param sessionId
     * @return
     */
    @Login
    @GetMapping("/{sessionId}/submissions")
    @JsonView(Views.Frontend.class)
    public AjaxResult list(@PathVariable String sessionId) {
        List<AieduClassroomSessionStudentWorkPO> list;
        PageDomain pageDomain = TableSupport.buildPageRequest();
        String orderBy = SqlUtil.escapeOrderBySql(pageDomain.getOrderBy());
        if (StringUtils.hasLength(orderBy)) {
            PageHelper.orderBy(orderBy);
        }
        list = aieduClassroomSessionStudentWorkPOMapper.selectByClassroomSessionId(sessionId);

        // 按学生studentId分组合并
        Map<String, List<AieduClassroomSessionStudentWorkPO>> collect = list.stream()
                .collect(Collectors.groupingBy(AieduClassroomSessionStudentWorkPO::getStudentId));

        List<AieduClassroomSessionStudentWorkPO> result = new ArrayList<>();
        collect.forEach((studentId, workList) -> {
            AieduClassroomSessionStudentWorkPO po = workList.get(0);
            List<AieduClassroomSessionStudentWork> works = workList.stream()
                    .map(p-> {
                        AieduClassroomSessionStudentWork jsonObject = new AieduClassroomSessionStudentWork();
                        jsonObject.setContent(getJsonObject(p.getContentJson()));
                        jsonObject.setSubmittedAt(p.getSubmittedAt());
                        jsonObject.setFinalSubmit(p.getFinalSubmit());
                        return jsonObject;
                    })
                    .collect(Collectors.toList());
            po.setSubmissions(works);
            result.add(po);
        });
        return AjaxResult.success(result);
    }

    /**
     * todo Shine 批量下载学生作品
     *
     * @param sessionId
     * @return
     */
    @Login
    @PostMapping("/{sessionId}/submissions/download")
    public void downloadSubmissions(@PathVariable String sessionId,
                                    @RequestBody ClassroomSessionWorkDownloadQuery query) {
        List<Integer> ids = query.getIds();
        if (CollectionUtils.isEmpty(ids)) {
            // 下载全部作品
        } else {
            // 下载指定作品
        }
    }

    /**
     * 获取测验题目
     *
     * @param sessionId
     * @return
     */
    @GetMapping("/{sessionId}/quiz/questions")
    public AjaxResult quizQuestions(@PathVariable Integer sessionId) {
        AieduClassroomSessionPO sessionPO = aieduClassroomSessionPOMapper.selectByPrimaryKey(sessionId);
        JSONObject quizConfig = getJsonObject(sessionPO.getQuizConfigJson());
        Boolean enabled = quizConfig.getBoolean("enabled");
        if (!enabled) {
            return AjaxResult.success(new ArrayList<>());
        }
        JSONArray questions = quizConfig.getJSONArray("questions");
        return AjaxResult.success(questions);
    }

    /**
     * 学生提交测验答题
     *
     * @param sessionId
     * @param query
     * @return
     */
    @PostMapping("/{sessionId}/quiz/submit")
    public AjaxResult submitQuiz(@PathVariable Integer sessionId,
                                 @Validated @RequestBody AieduClassroomSessionStudentPO query) {
        JSONArray quizAnswers = query.getQuizAnswers();
        if (quizAnswers == null) {
            quizAnswers = new JSONArray();
        }
        aieduClassroomSessionStudentPOMapper.updateQuizAnswers(sessionId, quizAnswers.toJSONString(), query.getStudentId());
        // 生成测验结果
        QuizResult quizResult = new QuizResult();
        int score = 0;
        int totalQuestions = 0;
        int correctCount = 0;
        List<QuestionResult> results = new ArrayList<>();
        try {
            AieduClassroomSessionPO sessionPO = aieduClassroomSessionPOMapper.selectByPrimaryKey(sessionId);
            JSONObject quizConfig = getJsonObject(sessionPO.getQuizConfigJson());
            JSONArray questions = quizConfig.getJSONArray("questions");
            totalQuestions = questions.size();
            for (int i = 0; i < questions.size(); i++) {
                AieduQuizQuestionPO questionPO = questions.getObject(i, AieduQuizQuestionPO.class);
                String type = questionPO.getType();
                Integer points = questionPO.getPoints();
                String answerJson = questionPO.getAnswerJson();
                QuestionResult questionResult = new QuestionResult();
                questionResult.setType(type);
                questionResult.setQuestionId(questionPO.getId());
                if (i < quizAnswers.size()) {
                    JSONObject quizAnswer = quizAnswers.getJSONObject(i);
                    if ("single".equals(type)
                            || "multiple".equals(type)) {
                        JSONArray correctAnswer = JSON.parseArray(answerJson);
                        JSONArray studentAnswer = quizAnswer.getJSONArray("answer");
                        if (isEqualJsonArray(correctAnswer, studentAnswer)) {
                            score += points;
                            correctCount++;
                            questionResult.setIsCorrect(true);
                        } else {
                            questionResult.setIsCorrect(false);
                        }
                        questionResult.setCorrectAnswer(correctAnswer);
                        questionResult.setStudentAnswer(studentAnswer);
                    } else if ("boolean".equals(type)) {
                        Integer correctAnswer = JSON.parseObject(answerJson, Integer.class);
                        Integer studentAnswer = quizAnswer.getInteger("answer");
                        if (correctAnswer.equals(studentAnswer)) {
                            score += points;
                            correctCount++;
                            questionResult.setIsCorrect(true);
                        } else {
                            questionResult.setIsCorrect(false);
                        }
                        questionResult.setCorrectAnswer(correctAnswer);
                        questionResult.setStudentAnswer(studentAnswer);
                    } else {
                        System.err.println("未知的题型:" + type);
                        questionResult.setIsCorrect(false);
                        questionResult.setCorrectAnswer(answerJson);
                        questionResult.setStudentAnswer(quizAnswer.get("answer"));
                    }
                } else {
                    // 未完成
                    if ("single".equals(type)
                            || "multiple".equals(type)) {
                        JSONArray correctAnswer = JSON.parseArray(answerJson);
                        questionResult.setIsCorrect(false);
                        questionResult.setCorrectAnswer(correctAnswer);
                        questionResult.setStudentAnswer("");
                    } else if ("boolean".equals(type)) {
                        Integer correctAnswer = JSON.parseObject(answerJson, Integer.class);
                        questionResult.setIsCorrect(false);
                        questionResult.setCorrectAnswer(correctAnswer);
                        questionResult.setStudentAnswer("");
                    } else {
                        System.err.println("未知的题型:" + type);
                        questionResult.setIsCorrect(false);
                        questionResult.setCorrectAnswer(answerJson);
                        questionResult.setStudentAnswer("");
                    }
                }
                results.add(questionResult);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        quizResult.setScore(score);
        quizResult.setTotalQuestions(totalQuestions);
        quizResult.setCorrectCount(correctCount);
        quizResult.setResults(results);
        aieduClassroomSessionStudentPOMapper.updateQuizResult(sessionId, query.getStudentId(), JSON.toJSONString(quizResult));
        // 返回测验结果
        return AjaxResult.success(quizResult);
    }

    /**
     * 判断两个JSONArray是否相等
     *
     * @param correctAnswer
     * @param studentAnswer
     * @return
     */
    private boolean isEqualJsonArray(JSONArray correctAnswer, JSONArray studentAnswer) {
        List<Object> correctList = correctAnswer.toJavaList(Object.class);
        List<Object> studentList = studentAnswer.toJavaList(Object.class);

        // 检查两个列表长度是否相同，且相互包含所有元素
        return correctList.size() == studentList.size() &&
                correctList.containsAll(studentList) &&
                studentList.containsAll(correctList);
    }
}

