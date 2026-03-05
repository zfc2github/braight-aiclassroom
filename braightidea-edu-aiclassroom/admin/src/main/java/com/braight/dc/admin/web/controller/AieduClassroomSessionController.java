package com.braight.dc.admin.web.controller;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.RandomUtil;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.braight.dc.admin.web.constants.Constant;
import com.braight.dc.admin.web.dto.*;
import com.braight.dc.admin.web.entity.*;
import com.braight.dc.admin.web.mapper.*;
import com.braight.dc.admin.web.service.AieduClassroomSessionService;
import com.braight.dc.admin.web.utils.ControllerUtil;
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
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

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
    @Resource
    private AieduClassroomSessionService aieduClassroomSessionService;


    @Login
    @Log(title = "课堂会话信息", businessType = BusinessType.INSERT)
    @PostMapping("/create")
    public AjaxResult sessionCreate(@Validated @RequestBody AieduClassroomSessionPO po) {
        AieduTeachersPO teacher = aieduTeachersPOMapper.selectByUserId(getUserId());
        po.setTeacherId(teacher.getTeacherId());
        po.setTeacherName(teacher.getName());

        AieduClassroomsPO classroomsPO = aieduClassroomsPOMapper.selectByPrimaryKey(po.getClassroomId());
        // 重复提交校验
        AieduClassroomSessionPO activeSession = getActiveSession(po);
        if (!Objects.isNull(activeSession)) {
            getWorks(activeSession, classroomsPO);
            return AjaxResult.success(activeSession);
        }

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
            aieduClassroomSessionStudentPOMapper.insert(row);
        });

        getWorks(po, classroomsPO);
        return AjaxResult.success(po);
    }

    private void getWorks(AieduClassroomSessionPO po, AieduClassroomsPO classroomsPO) {
        po.setAiTool(ControllerUtil.getJsonObject(classroomsPO.getAiToolJson()));
        po.setCourseware(ControllerUtil.getJsonObject(classroomsPO.getCoursewareJson()));
        po.setQuizConfig(ControllerUtil.getJsonObject(classroomsPO.getQuizConfigJson()));
    }


    /**
     * 获取课堂会话信息（会话状态）
     *
     * @param sessionId
     * @return
     */
    @Login
    @Log(title = "课堂会话信息", businessType = BusinessType.QUERY)
    @GetMapping("/{sessionId}")
    public AjaxResult getInfo(@PathVariable Integer sessionId) {
        AieduClassroomSessionPO po = aieduClassroomSessionPOMapper.selectByPrimaryKey(sessionId);
        return AjaxResult.success(po);
    }

    @Login
    @Log(title = "课堂会话信息-状态更新", businessType = BusinessType.OTHER)
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

    /**
     * 结束课堂会话
     *
     * @param sessionId
     * @return
     */
    @Login
    @Log(title = "课堂会话信息-结束课堂", businessType = BusinessType.OTHER)
    @PostMapping("/{sessionId}/end")
    public AjaxResult endSession(@PathVariable Integer sessionId) {
        AieduClassroomSessionPO po = new AieduClassroomSessionPO();
        po.setId(sessionId);
        po.setCurrentStage(Constant.ClassroomSessionCurrentStage.COMPLETED);
        po.setStatus(Constant.ClassroomSessionStatus.ENDED);
        aieduClassroomSessionPOMapper.updateStageStatus(po);
        // 推送websocket消息：结束课堂会话
        wsService.endClassroomSession(sessionId);
        return AjaxResult.success();
    }

    @Login
    @Log(title = "课堂会话信息-课件信息", businessType = BusinessType.QUERY)
    @GetMapping("/{sessionId}/courseware")
    public AjaxResult getCoursewareInfo(@PathVariable Integer sessionId) {
        AieduClassroomSessionPO po = aieduClassroomSessionPOMapper.selectByPrimaryKey(sessionId);
        AieduClassroomsPO classroomsPO = aieduClassroomsPOMapper.selectByPrimaryKey(po.getClassroomId());
        JSONObject courseware = ControllerUtil.getJsonObject(classroomsPO.getCoursewareJson());
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

    private AieduClassroomSessionPO getActiveSession(AieduClassroomSessionPO po) {
        List<AieduClassroomSessionPO> list = aieduClassroomSessionPOMapper.selectActiveSession(po);
        return list.size() > 0 ? list.get(0) : null;
    }

    /**
     * 加入课堂
     *
     * @param query
     * @return
     */
    @Log(title = "课堂会话信息-学生加入课堂", businessType = BusinessType.OTHER)
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
        if (Objects.isNull(joinedStudent)) {
            joinedStudent = aieduClassroomSessionStudentPOMapper.selectStudent(classroomSessionId, studentId);
            if (Objects.isNull(joinedStudent)) {
                List<AieduStudentPO> students = aieduStudentPOMapper.selectListByStudentIdAndClassId(studentId, activePo.getClassId());
                AieduStudentPO student = students.get(0);
                joinedStudent = new AieduClassroomSessionStudentPO();
                joinedStudent.setClassroomSessionId(activePo.getId());
                joinedStudent.setStudentId(student.getStudentId());
                joinedStudent.setStudentName(student.getName());
                joinedStudent.setJoinedAt(new Date());
                joinedStudent.setWorkStatus(Constant.ClassroomStatus.WAITING);
                joinedStudent.setApiCount(0);
                joinedStudent.setQuizStatus(Constant.ClassroomStatus.WAITING);
                aieduClassroomSessionStudentPOMapper.insert(joinedStudent);
            } else {
                joinedStudent.setJoinedAt(new Date());
                aieduClassroomSessionStudentPOMapper.updateSelective(joinedStudent);
            }
        }


        // 返回课堂信息、学生信息、在线学生数量等
        ClassroomSessionJoinVO vo = new ClassroomSessionJoinVO();
        vo.setSessionId(classroomSessionId);
        vo.setStudentId(studentId);
        vo.setStudentName(joinedStudent.getStudentName());
        vo.setClassCode(classCode);
        vo.setClassroomName(activePo.getClassroomName());
        vo.setCurrentStage(activePo.getCurrentStage());
        vo.setJoinedAt(joinedStudent.getJoinedAt());
        vo.setAiTool(ControllerUtil.getJsonObject(activePo.getAiToolJson()));

        AieduClassroomSessionStudentPO param = new AieduClassroomSessionStudentPO();
        param.setClassroomSessionId(classroomSessionId);
        int count = aieduClassroomSessionStudentPOMapper.selectJoinedCountByEntity(param);
        vo.setOnlineStudentCount(count);

        // 推送websocket消息：学生加入课堂
        wsService.studentJoinClassroomSession(classroomSessionId);
        return AjaxResult.success(vo);
    }

    /**
     * 获取课堂的学生列表
     *
     * @param sessionId
     * @return
     */
    @Login
    @Log(title = "课堂会话信息-课堂学生列表", businessType = BusinessType.QUERY)
    @GetMapping("/{sessionId}/students")
    public AjaxResult getStudents(@PathVariable Integer sessionId) {
        List<AieduClassroomSessionStudentPO> students = aieduClassroomSessionStudentPOMapper.selectStudentsByClassroomSessionId(sessionId);
        return AjaxResult.success(students);
    }

    /**
     * 获取加入课堂的学生列表
     *
     * @param sessionId
     * @return
     */
    @Login
    @Log(title = "课堂会话信息-加入课堂的学生列表", businessType = BusinessType.QUERY)
    @GetMapping("/{sessionId}/joinedStudents")
    public AjaxResult getJoinedStudents(@PathVariable Integer sessionId) {
        AieduClassroomSessionStudentPO entity = new AieduClassroomSessionStudentPO();
        entity.setClassroomSessionId(sessionId);
        List<AieduClassroomSessionStudentPO> students = aieduClassroomSessionStudentPOMapper.selectJoinedByEntity(entity);
        return AjaxResult.success(students);
    }

    /**
     * 开始学生实验
     *
     * @param sessionId
     * @return
     */
    @Login
    @Log(title = "课堂会话信息-开始学生实验", businessType = BusinessType.OTHER)
    @GetMapping("/{sessionId}/startToolExperience")
    public AjaxResult startToolExperience(@PathVariable Integer sessionId) {
        // 更新当前阶段
//        AieduClassroomSessionPO session = aieduClassroomSessionPOMapper.selectByPrimaryKey(sessionId);
        aieduClassroomSessionPOMapper.updateCurrentStage(sessionId, Constant.ClassroomSessionCurrentStage.TOOL_EXPERIENCE);
        // 更新作业状态
        aieduClassroomSessionStudentPOMapper.updateWorkStatusByClassroomSessionId(sessionId, Constant.ClassroomStatus.IN_PROGRESS);
        // 发送websocket消息：开始学生实验
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
    @Log(title = "课堂会话信息-开始测验", businessType = BusinessType.OTHER)
    @GetMapping("/{sessionId}/startQuiz")
    public AjaxResult startQuiz(@PathVariable Integer sessionId) {
        // 更新当前阶段
//        AieduClassroomSessionPO session = aieduClassroomSessionPOMapper.selectByPrimaryKey(sessionId);
        aieduClassroomSessionPOMapper.updateCurrentStage(sessionId, Constant.ClassroomSessionCurrentStage.QUIZ);
        // 更新测验状态
        aieduClassroomSessionStudentPOMapper.updateQuizStatusByClassroomSessionId(sessionId, Constant.QuizStatus.READY);
        // 发送websocket消息：开始测验
        wsService.publishQuiz(sessionId);
        return AjaxResult.success();
    }

    /**
     * 学生提交作品
     *
     * @param po
     * @return
     */
    @Log(title = "课堂会话信息-学生提交作品", businessType = BusinessType.OTHER)
    @PostMapping("/submitWork")
    public AjaxResult submitWork(@Validated @RequestBody AieduClassroomSessionStudentWorkPO po) {
        // todo Shine 是否限制提交次数
        po.setContentJson(ControllerUtil.getJsonString(po.getContent()));
        po.setSubmittedAt(new Date());
        aieduClassroomSessionStudentWorkPOMapper.insert(po);
        if (po.getFinalSubmit()) {
            // 更新作业状态为 completed
            aieduClassroomSessionStudentPOMapper.completedWorkStatusByClassroomSessionIdStudentId(
                    po.getClassroomSessionId(),
                    po.getStudentId(),
                    Constant.ClassroomStatus.COMPLETED);
        }
        wsService.submitWork(po.getClassroomSessionId());
        return AjaxResult.success();
    }

    /**
     * API调用记数（调用一次+1）
     * @param sessionId
     * @param studentId
     * @return
     */
    @Log(title = "课堂会话信息-API调用记数", businessType = BusinessType.OTHER)
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



    /**
     * 获取学生作品列表
     *
     * @param sessionId
     * @return
     */
    @Login
    @Log(title = "课堂会话信息-学生作品列表", businessType = BusinessType.QUERY)
    @GetMapping("/{sessionId}/submissions")
    @JsonView(Views.Frontend.class)
    public AjaxResult list(@PathVariable Integer sessionId) {
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
                        jsonObject.setContent(ControllerUtil.getJsonObject(p.getContentJson()));
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
     * 一键下载全部
     *
     * @param sessionId
     * @return
     */
    @Login
    @Log(title = "课堂会话信息-一键下载全部", businessType = BusinessType.OTHER)
    @PostMapping("/{sessionId}/submissions/download")
    public void downloadSubmissions(@PathVariable Integer sessionId,
                                    @RequestBody ClassroomSessionWorkDownloadQuery query,
                                    HttpServletResponse response) {
        List<Integer> ids = query.getIds();
        List<AieduClassroomSessionStudentWorkPO> all = aieduClassroomSessionStudentWorkPOMapper.selectByClassroomSessionId(sessionId);
        List<AieduClassroomSessionStudentWorkPO> finalSubmitWork = all.stream()
                .filter(AieduClassroomSessionStudentWorkPO::getFinalSubmit)
                .collect(Collectors.toList());
        if (!CollectionUtils.isEmpty(ids)) {
            // 下载指定作品
            finalSubmitWork = finalSubmitWork.stream()
                    .filter(p -> ids.contains(p.getId()))
                    .collect(Collectors.toList());
        }
        List<AieduClassroomSessionStudentPO> allStudents = aieduClassroomSessionStudentPOMapper.selectStudentsByClassroomSessionId(sessionId);
        List<StudentQuizScore> quizScores = aieduClassroomSessionService.getStudentQuizScores(allStudents);
        quizScores.sort(Comparator.comparing(StudentQuizScore::getScore).reversed());
        String language = query.getLanguage();

        List<StudentWork> works = aieduClassroomSessionService.getWorks(finalSubmitWork);

      // 将所有url下载下来并添加到zip中并返回到前端供直接下载
        try {
            // 设置响应头
            // 设置响应头 - 使用UTF-8编码处理中文文件名
            String encodedFileName = URLEncoder.encode("学生作品_" + sessionId + "_" + System.currentTimeMillis() + ".zip", "UTF-8");
            response.setContentType("application/zip");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + encodedFileName + "\"");
            // 同时设置RFC 6266标准的国际化文件名
            response.setHeader("Content-Disposition", response.getHeader("Content-Disposition") + "; filename*=UTF-8''" + encodedFileName);


            // 创建ZIP输出流
            try (ZipOutputStream zipOut = new ZipOutputStream(response.getOutputStream())) {
                addQuizScoresToZip(quizScores, language, zipOut);
                for (int i = 0; i < works.size(); i++) {
                    StudentWork work = works.get(i);
                    try {
                        // 使用HttpClient或OkHttp等库进行更可靠的下载
                        URL url = new URL(work.getUrl());
                        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                        connection.setRequestMethod("GET");
                        connection.setConnectTimeout(10000); // 10秒连接超时
                        connection.setReadTimeout(30000);   // 30秒读取超时

                        try (InputStream inputStream = connection.getInputStream()) {

                            // 确保文件名唯一，避免冲突
                            String uniqueFileName = work.getStudentId() + "_" + work.getStudentName() + "_" + extractFileNameUsingUri(work.getUrl());

                            ZipEntry zipEntry = new ZipEntry(uniqueFileName);
                            zipOut.putNextEntry(zipEntry);

                            // 将文件内容复制到ZIP输出流
                            byte[] buffer = new byte[8192]; // 增大缓冲区提高性能
                            int bytesRead;
                            while ((bytesRead = inputStream.read(buffer)) != -1) {
                                zipOut.write(buffer, 0, bytesRead);
                            }

                            zipOut.closeEntry();
                        }

                    } catch (IOException e) {
                        // 记录错误但继续处理其他文件
                        System.err.println("无法下载文件: " + work.getUrl() + ", 错误: " + e.getMessage());

                        // 可以创建一个错误说明文件放入ZIP中
                        String errorFileName = work.getStudentId() + "_error.txt";
                        ZipEntry errorEntry = new ZipEntry(errorFileName);
                        zipOut.putNextEntry(errorEntry);
                        String errorMessage = "Error downloading file from: " + work.getUrl() + "\nError: " + e.getMessage();
                        zipOut.write(errorMessage.getBytes());
                        zipOut.closeEntry();
                    }
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 将 quizScores 数据生成 CSV 并添加到 ZIP 输出流中
     *
     * @param quizScores 学生成绩列表
     * @param language   语言（zh 或 en）
     * @param zipOut     ZIP 输出流
     * @throws IOException IO 异常
     */
    private void addQuizScoresToZip(List<StudentQuizScore> quizScores, String language, ZipOutputStream zipOut) throws IOException {
        // 确定表头和文件名
        String[] headers;
        String fileName;
        if ("zh".equalsIgnoreCase(language)) {
            headers = new String[]{"排名", "学号", "得分", "提交时间"};
            fileName = "学生成绩表.csv";
        } else {
            headers = new String[]{"Rank", "StudentId", "StudentName", "Score", "SubmittedAt"};
            fileName = "student_scores.csv";
        }

        // 构建 CSV 内容
        StringBuilder csvContent = new StringBuilder();
        // 添加表头
        csvContent.append(String.join(",", headers)).append("\n");

        // 添加数据行
        for (int i = 0; i < quizScores.size(); i++) {
            StudentQuizScore score = quizScores.get(i);
            String rank = String.valueOf(i + 1); // 排名从 1 开始
            String studentId = score.getStudentId();
            String studentName = score.getStudentName();
            String scoreValue = String.valueOf(score.getScore());
            String submittedAt = score.getSubmittedAt() != null ? DateUtil.formatDateTime(score.getSubmittedAt()) : "";

            if ("zh".equalsIgnoreCase(language)) {
                csvContent.append(String.join(",", rank, studentId, scoreValue, submittedAt)).append("\n");
            } else {
                csvContent.append(String.join(",", rank, studentId, studentName, scoreValue, submittedAt)).append("\n");
            }
        }

        // 将 CSV 文件添加到 ZIP 输出流
        ZipEntry zipEntry = new ZipEntry(fileName);
        zipOut.putNextEntry(zipEntry);
        zipOut.write(csvContent.toString().getBytes(StandardCharsets.UTF_8));
        zipOut.closeEntry();
    }


    /**
     * 使用URI类从URL中提取文件名
     * @param urlString URL字符串
     * @return 文件名（包含扩展名）
     */
    private String extractFileNameUsingUri(String urlString) {
        try {
            URI uri = new URI(urlString);
            String path = uri.getPath();
            if (path != null) {
                int lastSlashIndex = path.lastIndexOf('/');
                if (lastSlashIndex != -1) {
                    return path.substring(lastSlashIndex + 1);
                }
                return path;
            }
        } catch (URISyntaxException e) {
            // 处理异常
            System.err.println("Invalid URL: " + e.getMessage());
        }
        return "";
    }

    /**
     * 获取测验题目
     *
     * @param sessionId
     * @return
     */
    @Log(title = "课堂会话信息-测验题目列表", businessType = BusinessType.QUERY)
    @GetMapping("/{sessionId}/quiz/questions")
    public AjaxResult quizQuestions(@PathVariable Integer sessionId) {
        AieduClassroomSessionPO sessionPO = aieduClassroomSessionPOMapper.selectByPrimaryKey(sessionId);
        JSONObject quizConfig = ControllerUtil.getJsonObject(sessionPO.getQuizConfigJson());
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
    @Log(title = "课堂会话信息-学生提交测验", businessType = BusinessType.OTHER)
    @PostMapping("/{sessionId}/quiz/submit")
    public AjaxResult submitQuiz(@PathVariable Integer sessionId,
                                 @Validated @RequestBody AieduClassroomSessionStudentPO query) {
        JSONArray quizAnswers = query.getQuizAnswers();
        if (quizAnswers == null) {
            quizAnswers = new JSONArray();
        }
        // 生成测验结果
        QuizResult quizResult = new QuizResult();
        quizResult.setStudentId(query.getStudentId());
        quizResult.setStudentName(query.getStudentName());

        int score = 0;
        int totalQuestions = 0;
        int unansweredCount = 0;
        int correctCount = 0;
        List<QuestionResult> results = new ArrayList<>();
        try {
            AieduClassroomSessionPO sessionPO = aieduClassroomSessionPOMapper.selectByPrimaryKey(sessionId);
            JSONObject quizConfig = ControllerUtil.getJsonObject(sessionPO.getQuizConfigJson());
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
                            || "multiple".equals(type)
                            || "boolean".equals(type)) {
                        JSONArray correctAnswer = JSON.parseArray(answerJson);
                        JSONArray studentAnswer = quizAnswer.getJSONArray("answer");
                        if (studentAnswer == null || studentAnswer.isEmpty()) {
                            studentAnswer = new JSONArray();
                            unansweredCount++;
                        }
                        if (isEqualJsonArray(correctAnswer, studentAnswer)) {
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
                        questionResult.setCorrectAnswer(JSONArray.of(answerJson));
                        questionResult.setStudentAnswer(JSONArray.of(quizAnswer.get("answer")));
                    }
                } else {
                    // 未完成
                    unansweredCount++;
                    if ("single".equals(type)
                            || "multiple".equals(type)
                            || "boolean".equals(type)) {
                        JSONArray correctAnswer = JSON.parseArray(answerJson);
                        questionResult.setIsCorrect(false);
                        questionResult.setCorrectAnswer(correctAnswer);
                        questionResult.setStudentAnswer(new JSONArray());
                    } else {
                        System.err.println("未知的题型:" + type);
                        questionResult.setIsCorrect(false);
                        questionResult.setCorrectAnswer(JSONArray.of(answerJson));
                        questionResult.setStudentAnswer(new JSONArray());
                    }
                }
                results.add(questionResult);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        quizResult.setScore(score);
        quizResult.setTotalQuestions(totalQuestions);
        quizResult.setAnsweredCount(totalQuestions - unansweredCount);
        quizResult.setCorrectCount(correctCount);
        quizResult.setResults(results);
        quizResult.setSubmittedAt(new Date());
//        aieduClassroomSessionStudentPOMapper.updateQuizAnswers(sessionId, quizAnswers.toJSONString(), query.getStudentId());
//        aieduClassroomSessionStudentPOMapper.updateQuizResult(sessionId, query.getStudentId(), JSON.toJSONString(quizResult));
//        aieduClassroomSessionStudentPOMapper.updateQuizStatusByClassroomSessionIdStudentId(sessionId, query.getStudentId(), Constant.ClassroomStatus.COMPLETED);
        AieduClassroomSessionStudentPO param = new AieduClassroomSessionStudentPO();
        param.setClassroomSessionId(sessionId);
        param.setStudentId(query.getStudentId());
        param.setQuizAnswersJsonarray(quizAnswers.toJSONString());
        param.setQuizResultJsonobject(JSON.toJSONString(quizResult));
        param.setQuizStatus(Constant.QuizStatus.SUBMITTED);
        param.setSubmittedAt(new Date());
        aieduClassroomSessionStudentPOMapper.updateSelectiveByClassroomSessionIdStudentId(param);

        wsService.submitQuiz(sessionId);
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

    /**
     * 获取学生参与情况
     *
     * @param sessionId
     * @return
     */
    @Log(title = "课堂会话信息-学生参与情况", businessType = BusinessType.QUERY)
    @GetMapping("/{sessionId}/student/participationStats")
    public AjaxResult studentParticipationStats(@PathVariable Integer sessionId) {
        List<AieduClassroomSessionStudentPO> sessionStudents = aieduClassroomSessionStudentPOMapper.selectStudentsByClassroomSessionId(sessionId);
        ParticipationStats stats = new ParticipationStats();
        stats.setClassroomSessionId(sessionId);
        stats.setTotal(sessionStudents.size());

        List<AieduClassroomSessionStudentPO> notJoined = sessionStudents.stream()
                .filter(s -> Objects.isNull(s.getJoinedAt()))
                .collect(Collectors.toList());
        stats.setNotJoinedStudents(notJoined);
        stats.setJoined(sessionStudents.size() - notJoined.size());

        List<AieduClassroomSessionStudentPO> waitingStudents = sessionStudents.stream()
                .filter(s -> Constant.ClassroomStatus.WAITING.equals(s.getWorkStatus()))
                .collect(Collectors.toList());
        stats.setWaitingStudents(waitingStudents);
        stats.setInProgress(sessionStudents.size() - waitingStudents.size());

        List<AieduClassroomSessionStudentPO> completedStudents = sessionStudents.stream()
                .filter(s -> Constant.ClassroomStatus.COMPLETED.equals(s.getWorkStatus()))
                .collect(Collectors.toList());
        stats.setCompleted(completedStudents.size());

        stats.setAllStudents(sessionStudents);
        return AjaxResult.success(stats);
    }

    /**
     * 获取学生API调用情况
     *
     * @param sessionId
     * @return
     */
    @Log(title = "课堂会话信息-学生API调用情况", businessType = BusinessType.QUERY)
    @GetMapping("/{sessionId}/student/apiInvokeStats")
    public AjaxResult studentApiInvokeStats(@PathVariable Integer sessionId) {
        ApiInvokeStats stats = aieduClassroomSessionService.getApiInvokeStats(sessionId);
        return AjaxResult.success(stats);
    }

    private ApiInvokeStats getApiInvokeStats(Integer sessionId) {
        List<AieduClassroomSessionStudentPO> sessionStudents = aieduClassroomSessionStudentPOMapper.selectStudentsByClassroomSessionId(sessionId);
        ApiInvokeStats stats = new ApiInvokeStats();
        stats.setClassroomSessionId(sessionId);
        List<StudentApiItem> studentApiItems = new ArrayList<>();
        List<String> xAxis = new ArrayList<>();
        List<Integer> seriesData = new ArrayList<>();
        sessionStudents.forEach(s -> {
            xAxis.add(s.getStudentName());
            int calls = s.getApiCount() == null ? 0 : s.getApiCount();
            seriesData.add(calls);
            StudentApiItem item = new StudentApiItem();
            item.setStudentName(s.getStudentName());
            item.setCalls(calls);
            studentApiItems.add(item);
        });
        stats.setXAxis(xAxis);
        stats.setSeriesData(seriesData);
        stats.setPerStudentApiCalls(studentApiItems);
        double avg = seriesData.stream()
                .mapToDouble(Integer::doubleValue)
                .average()
                .orElse(0.0);
        stats.setAvgCalls((int) avg);
        return stats;
    }

    /**
     * 获取学生测验情况
     *
     * @param sessionId
     * @return
     */
    @Log(title = "课堂会话信息-学生测验情况", businessType = BusinessType.QUERY)
    @GetMapping("/{sessionId}/student/quizStats")
    public AjaxResult studentQuizStats(@PathVariable Integer sessionId) {
        QuizStats stats = new QuizStats();
        List<AieduClassroomSessionStudentPO> sessionStudents = aieduClassroomSessionStudentPOMapper.selectStudentsByClassroomSessionId(sessionId);
        stats.setClassroomSessionId(sessionId);
        stats.setTotalStudents(sessionStudents.size());
        Map<String, List<AieduClassroomSessionStudentPO>> quizStatusMap = sessionStudents.stream()
                .collect(Collectors.groupingBy(AieduClassroomSessionStudentPO::getQuizStatus));
        List<AieduClassroomSessionStudentPO> submittedStudents = quizStatusMap.get(Constant.QuizStatus.SUBMITTED);
        if (CollectionUtils.isEmpty(submittedStudents)) {
            stats.setSubmitted(0);
            stats.setNotSubmitted(sessionStudents.size());
            stats.setAverageScore(0.0);
            stats.setScoreDistribution(calculateScoreDistribution(new ArrayList<>()));
            stats.setQuestionStats(new ArrayList<>());
            return AjaxResult.success(stats);
        }
        stats.setSubmitted(submittedStudents.size());
        stats.setNotSubmitted(sessionStudents.size() - submittedStudents.size());
        AtomicInteger totalScore = new AtomicInteger();
        List<QuestionResult> allQuizResults = new ArrayList<>();
        List<Integer> allScores = new ArrayList<>();
        submittedStudents.forEach(s -> {
            QuizResult quizResult = JSON.parseObject(s.getQuizResultJsonobject(), QuizResult.class);
            Integer score = quizResult.getScore();
            allScores.add(score);
            totalScore.addAndGet(score);
            allQuizResults.addAll(quizResult.getResults());
        });
        stats.setAverageScore((double) totalScore.get()/submittedStudents.size());
        // 分数分布统计 scoreDistribution
        Map<String, Integer> scoreDistribution = calculateScoreDistribution(allScores);
        stats.setScoreDistribution(scoreDistribution);

        // questionStats
        Map<Integer, List<QuestionResult>> questionIdMap = allQuizResults.stream()
                .collect(Collectors.groupingBy(QuestionResult::getQuestionId));
        List<QuestionStats> questionStats = new ArrayList<>();
        questionIdMap.forEach((questionId, questionResults) -> {
            QuestionStats questionStat = new QuestionStats();
            questionStat.setQuestionId(questionId);
            int correctCount = (int) questionResults.stream().filter(QuestionResult::getIsCorrect).count();
            questionStat.setCorrectCount(correctCount);
            int wrongCount = questionResults.size() - correctCount;
            questionStat.setWrongCount(wrongCount);
            double accuracy = (double) correctCount / questionResults.size();
            questionStat.setAccuracy(accuracy);
            questionStats.add(questionStat);
        });
        stats.setQuestionStats(questionStats);
        return AjaxResult.success(stats);
    }

    private Map<String, Integer> calculateScoreDistribution(List<Integer> allScores) {
        // 初始化各分数段计数器
        Map<String, Integer> distribution = new HashMap<>();
        distribution.put("90-100", 0);
        distribution.put("80-89", 0);
        distribution.put("70-79", 0);
        distribution.put("60-69", 0);
        distribution.put("0-59", 0);

        // 遍历所有学生，统计分数分布
        for (Integer score : allScores) {
            // 如果没有分数则跳过
            if (score == null) {
                continue;
            }

            // 根据分数范围增加对应计数
            if (score >= 90 && score <= 100) {
                distribution.put("90-100", distribution.get("90-100") + 1);
            } else if (score >= 80 && score < 90) {
                distribution.put("80-89", distribution.get("80-89") + 1);
            } else if (score >= 70 && score < 80) {
                distribution.put("70-79", distribution.get("70-79") + 1);
            } else if (score >= 60 && score < 70) {
                distribution.put("60-69", distribution.get("60-69") + 1);
            } else if (score >= 0 && score < 60) {
                distribution.put("0-59", distribution.get("0-59") + 1);
            }
        }
        return distribution;
    }

    /**
     * 获取测验答案列表
     *
     * @param sessionId
     * @return
     */
    @Log(title = "课堂会话信息-测验答案列表", businessType = BusinessType.QUERY)
    @GetMapping("/{sessionId}/quiz/submissions")
    public AjaxResult quizSubmissions(@PathVariable Integer sessionId) {
        List<AieduClassroomSessionStudentPO> list;
        PageDomain pageDomain = TableSupport.buildPageRequest();
        String orderBy = SqlUtil.escapeOrderBySql(pageDomain.getOrderBy());
        if (StringUtils.hasLength(orderBy)) {
            PageHelper.orderBy(orderBy);
        }
        list = aieduClassroomSessionStudentPOMapper.selectStudentsByClassroomSessionId(sessionId);

        List<QuizResult> result = list.stream()
                .filter(s -> !Objects.isNull(s.getQuizResultJsonobject()))
                .map(s -> JSON.parseObject(s.getQuizResultJsonobject(), QuizResult.class))
                .collect(Collectors.toList());
        return AjaxResult.success(result);
    }

    /**
     * 获取会话状态数据
     *
     * @param sessionId
     * @return
     */
    @Log(title = "课堂会话信息-会话状态数据", businessType = BusinessType.QUERY)
    @GetMapping("/{sessionId}/sessionData")
    public AjaxResult sessionData(@PathVariable Integer sessionId) {
      AieduClassroomSessionPO sessionPO = aieduClassroomSessionPOMapper.selectByPrimaryKey(sessionId);
      if (sessionPO == null) {
        return AjaxResult.error("会话不存在");
      }
      Object result = aieduClassroomSessionService.getSessionData(sessionId, sessionPO);
      return AjaxResult.success(result);
    }






    /**
     * 更新课堂会话-测验题目配置
     *
     * @param sessionId
     * @param po
     * @return
     */
    @Login
    @Log(title = "课堂会话信息-测验题目配置", businessType = BusinessType.UPDATE)
    @PostMapping("/{sessionId}/updateQuizConfig")
    public AjaxResult updateQuizConfig(@PathVariable Integer sessionId,
                                  @RequestBody AieduClassroomSessionPO po) {
        po.setId(sessionId);
        JSONObject quizConfig = po.getQuizConfig();
        if (!Objects.isNull(quizConfig)) {
            po.setQuizConfigJson(quizConfig.toJSONString());
        } else {
            po.setQuizConfigJson(new JSONObject().toJSONString());
        }
        aieduClassroomSessionPOMapper.updateQuizConfig(po);
        return AjaxResult.success();
    }

    /**
     * 学生开始测验
     *
     * @param sessionId
     * @param studentId
     * @return
     */
    @Log(title = "课堂会话信息-学生开始测验", businessType = BusinessType.OTHER)
    @GetMapping("/{sessionId}/studentStartQuiz")
    public AjaxResult studentStartQuiz(@PathVariable Integer sessionId,
                                       @RequestParam String studentId) {
        // 更新测验状态
        aieduClassroomSessionStudentPOMapper.updateQuizStatusByClassroomSessionIdStudentId(sessionId, studentId, Constant.QuizStatus.ANSWERING);
        return AjaxResult.success();
    }

}

