package com.braight.dc.admin.web.service;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.braight.dc.admin.web.constants.Constant;
import com.braight.dc.admin.web.dto.*;
import com.braight.dc.admin.web.entity.AieduClassroomSessionPO;
import com.braight.dc.admin.web.entity.AieduClassroomSessionStudentPO;
import com.braight.dc.admin.web.entity.AieduClassroomSessionStudentWorkPO;
import com.braight.dc.admin.web.mapper.AieduClassroomSessionStudentPOMapper;
import com.braight.dc.admin.web.mapper.AieduClassroomSessionStudentWorkPOMapper;
import com.braight.dc.admin.web.utils.ControllerUtil;
import com.braight.master.common.core.redis.RedisCache;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * @author Shine
 * @date 2026/2/11
 */
@Service
public class AieduClassroomSessionService {
  @Resource
  private RedisCache redisCache;
  @Resource
  private AieduClassroomSessionStudentPOMapper aieduClassroomSessionStudentPOMapper;
  @Resource
  private AieduClassroomSessionStudentWorkPOMapper aieduClassroomSessionStudentWorkPOMapper;

  private static ClassroomSessionStudentVO apply(AieduClassroomSessionStudentPO s) {
    ClassroomSessionStudentVO vo = new ClassroomSessionStudentVO();
    vo.setId(s.getId());
    vo.setStudentId(s.getStudentId());
    vo.setStudentName(s.getStudentName());
    vo.setWorkStatus(s.getWorkStatus());
    vo.setSubmittedAt(s.getSubmittedAt());
    vo.setQuizStatus(s.getQuizStatus());
    return vo;
  }

  public Object getSessionData(Integer sessionId, AieduClassroomSessionPO sessionPO) {
    Object cacheObject = redisCache.getCacheObject(Constant.RedisCacheKey.SESSION_DATA + sessionId);
    if (!Objects.isNull(cacheObject)) {
      return cacheObject;
    }

    SessionData sessionData = new SessionData();
    synchronized (this) {
      cacheObject = redisCache.getCacheObject(Constant.RedisCacheKey.SESSION_DATA + sessionId);
      if (!Objects.isNull(cacheObject)) {
        return cacheObject;
      }
      sessionData.setLastUpdated(new Date());
      sessionData.setSessionId(sessionPO.getId());
      sessionData.setCurrentStage(sessionPO.getCurrentStage());
      sessionData.setQuizConfig(ControllerUtil.getJsonObject(sessionPO.getQuizConfigJson()));

      AieduClassroomSessionStudentPO ss = new AieduClassroomSessionStudentPO();
      ss.setClassroomSessionId(sessionId);
      List<AieduClassroomSessionStudentPO> all = aieduClassroomSessionStudentPOMapper.selectStudentsByClassroomSessionId(sessionId);
      sessionData.setTotalStudentCount(all.size());
      List<ClassroomSessionStudentVO> allStudents = all.stream()
              .map(AieduClassroomSessionService::apply)
              .collect(Collectors.toList());
      sessionData.setAllStudents(allStudents);

      List<AieduClassroomSessionStudentPO> joinedStudents = all.stream()
              .filter(s -> !Objects.isNull(s.getJoinedAt()))
              .collect(Collectors.toList());
//      sessionData.setJoinedStudents(joinedStudents);
      sessionData.setOnlineStudentCount(joinedStudents.size());
      sessionData.setJoined(joinedStudents.size());

      List<ClassroomSessionStudentVO> notJoinedStudents = all.stream()
              .filter(s -> Objects.isNull(s.getJoinedAt()))
              .map(AieduClassroomSessionService::apply)
              .collect(Collectors.toList());
      sessionData.setNotJoinedStudents(notJoinedStudents);

      List<ClassroomSessionStudentVO> notStartedStudents = all.stream()
              .filter(s -> Constant.ClassroomStatus.WAITING.equals(s.getWorkStatus()))
              .map(AieduClassroomSessionService::apply)
              .collect(Collectors.toList());
      sessionData.setNotStartedStudents(notStartedStudents);
      sessionData.setStarted(sessionData.getTotalStudentCount() - notStartedStudents.size());

      long count = all.stream()
              .filter(s -> Constant.ClassroomStatus.COMPLETED.equals(s.getWorkStatus()))
              .count();
      sessionData.setSubmitted((int) count);

      ApiInvokeStats apiInvokeStats = getApiInvokeStats(sessionId);
      sessionData.setApiInvokeStats(apiInvokeStats);

      sessionData.setQuizPublished(checkQuizPublished(sessionPO));
      List<AieduClassroomSessionStudentPO> quizStartedStudents = all.stream()
              .filter(s -> !Constant.QuizStatus.READY.equals(s.getQuizStatus()))
              .collect(Collectors.toList());
      sessionData.setQuizStarted(quizStartedStudents.size());

      List<AieduClassroomSessionStudentPO> quizCompletedStudents = all.stream()
              .filter(s -> Constant.QuizStatus.SUBMITTED.equals(s.getQuizStatus()))
              .collect(Collectors.toList());
      sessionData.setQuizCompleted(quizCompletedStudents.size());

      List<StudentQuizScore> quizScores = getStudentQuizScores(all);
      sessionData.setQuizScores(quizScores);
      double quizAverageScore = quizScores.stream()
              .map(StudentQuizScore::getScore)
              .mapToDouble(Integer::doubleValue)
              .average()
              .orElse(0);
      sessionData.setQuizAverageScore((int) quizAverageScore);

      List<AieduClassroomSessionStudentWorkPO> studentWorks = aieduClassroomSessionStudentWorkPOMapper.selectByClassroomSessionId(sessionId);
      Map<String, List<AieduClassroomSessionStudentWorkPO>> listMap = studentWorks.stream()
              .collect(Collectors.groupingBy(AieduClassroomSessionStudentWorkPO::getStudentId));
      sessionData.setArtifacts(getWorks(listMap));

      redisCache.setCacheObject(Constant.RedisCacheKey.SESSION_DATA+ sessionId, sessionData, 5, TimeUnit.SECONDS);
    }

    return sessionData;
  }

  public ApiInvokeStats getApiInvokeStats(Integer sessionId) {
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

  public List<StudentQuizScore> getStudentQuizScores(List<AieduClassroomSessionStudentPO> all) {
    List<StudentQuizScore> quizScores = all.stream()
            .map(s -> {
              StudentQuizScore score = new StudentQuizScore();
              JSONObject quizResult = ControllerUtil.getJsonObject(s.getQuizResultJsonobject());
              score.setStudentId(s.getStudentId());
              score.setStudentName(s.getStudentName());
              score.setSubmittedAt(s.getSubmittedAt());
              Integer sc = quizResult.getInteger("score");
              if (sc == null) {
                sc = 0;
              }
              score.setScore(sc);
              return score;
            })
            .collect(Collectors.toList());
    return quizScores;
  }

  public List<StudentWork> getWorks(List<AieduClassroomSessionStudentWorkPO> finalSubmittedWorks) {
    return finalSubmittedWorks.stream()
            .map(p -> {
                StudentWork work = new StudentWork();
                work.setStudentId(p.getStudentId());
                work.setStudentName(p.getStudentName());
                work.setSubmitType("final_only");
                work.setFinalAttempt(handleSubmitWork(p));
                work.setAllAttempts(Collections.singletonList(handleSubmitWork(p)));
                work.setSubmittedAt(p.getSubmittedAt());
                return work;
            })
            .collect(Collectors.toList());
  }

  public List<StudentWork> getWorks(Map<String, List<AieduClassroomSessionStudentWorkPO>> listMap) {
    List<StudentWork> results = new ArrayList<>();
    listMap.forEach((studentId, v) -> {
      if (v.size() == 1) {
        AieduClassroomSessionStudentWorkPO workPO = v.get(0);
        StudentWork work = new StudentWork();
        work.setStudentId(studentId);
        work.setStudentName(workPO.getStudentName());
        work.setSubmitType("final_only");
        SubmitWork submitWork = handleSubmitWork(workPO);
        work.setFinalAttempt(submitWork);
        work.setAllAttempts(Collections.singletonList(submitWork));
        work.setSubmittedAt(workPO.getSubmittedAt());
        work.setType(submitWork.getContent().getString("type"));
        work.setUrl(submitWork.getContent().getString("url"));
        work.setTrainingData(getTrainingData(submitWork));
        results.add(work);
      } else {
        AieduClassroomSessionStudentWorkPO workPO = v.stream()
                .filter(AieduClassroomSessionStudentWorkPO::getFinalSubmit)
                .findAny()
                .orElse(v.get(0));
        StudentWork work = new StudentWork();
        work.setStudentId(studentId);
        work.setStudentName(workPO.getStudentName());
        work.setSubmitType("with_process");
        SubmitWork submitWork = handleSubmitWork(workPO);
        work.setFinalAttempt(submitWork);
        List<SubmitWork> allAttempts = v.stream()
                .map(this::handleSubmitWork)
                .collect(Collectors.toList());
        work.setAllAttempts(allAttempts);
        work.setSubmittedAt(workPO.getSubmittedAt());
        work.setType(submitWork.getContent().getString("type"));
        work.setUrl(submitWork.getContent().getString("url"));
        work.setTrainingData(getTrainingData(submitWork));
        results.add(work);
      }
    });
    return results;
  }

  private JSONObject getTrainingData(SubmitWork workPO) {
    JSONObject content = workPO.getContent();
    JSONObject trainingData = content.getJSONObject("trainingData");
    return trainingData == null ? new JSONObject() : trainingData;
  }

  private SubmitWork handleSubmitWork(AieduClassroomSessionStudentWorkPO workPO) {
    SubmitWork submitWork = new SubmitWork();
    submitWork.setId(workPO.getId());
    String contentJson = workPO.getContentJson();
    if (StringUtils.hasLength(contentJson)) {
      submitWork.setContent(JSON.parseObject(contentJson));
    } else {
      submitWork.setContent(new JSONObject());
    }
    submitWork.setSubmittedAt(workPO.getSubmittedAt());
    return submitWork;
  }

  private Boolean checkQuizPublished(AieduClassroomSessionPO sessionPO) {
    return Constant.ClassroomSessionCurrentStage.QUIZ.equals(sessionPO.getCurrentStage())
            || Constant.ClassroomSessionCurrentStage.COMPLETED.equals(sessionPO.getCurrentStage());
  }
}
