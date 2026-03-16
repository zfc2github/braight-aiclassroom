package com.braight.dc.admin.websocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.*;

/**
 * @author Shine
 * @date 2026/1/15
 */
@Service
public class WsService {
    @Resource
    private SimpMessagingTemplate template;
    // 存储课堂和学生对应关系
    private final Map<Integer, Set<String>> classroomSessionStudents = new ConcurrentHashMap<>();
    // 创建单例调度线程池
    private static final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    /**
     * 广播：学生加入课堂
     *
     * @param classroomSessionId
     */
    public void studentJoinClassroomSession(Integer classroomSessionId) {
        WsEvent evt = new WsEvent(WsEvent.JOIN_CLASS,
                null,
                System.currentTimeMillis());
        Runnable runnable = () -> template.convertAndSend("/topic/classroomSession/" + classroomSessionId, evt);
        schedulerDo(runnable);
    }

    private void schedulerDo(Runnable runnable) {
        scheduler.schedule(runnable,
                2,
                TimeUnit.SECONDS);
    }

    /**
     * 广播：开始实验通知
     *
     * @param classroomSessionId
     */
    public void startToolExperience(Integer classroomSessionId) {
        WsEvent evt = new WsEvent(WsEvent.START_TOOL_EXPERIENCE,
                null,
                System.currentTimeMillis());
        Runnable runnable = () -> template.convertAndSend("/topic/classroomSession/" + classroomSessionId, evt);
        schedulerDo(runnable);
    }

    /**
     * 广播：开始测验通知
     *
     * @param classroomSessionId
     */
    public void publishQuiz(Integer classroomSessionId) {
        WsEvent evt = new WsEvent(WsEvent.TYPE_START_QUIZ,
                null,
                System.currentTimeMillis());
        Runnable runnable = () -> template.convertAndSend("/topic/classroomSession/" + classroomSessionId, evt);
        schedulerDo(runnable);
    }

    /**
     * 广播：学生提交测验
     *
     * @param classroomSessionId
     */
    public void submitQuiz(Integer classroomSessionId) {
        WsEvent evt = new WsEvent(WsEvent.TYPE_SUBMIT_QUIZ,
                null,
                System.currentTimeMillis());
        Runnable runnable = () -> template.convertAndSend("/topic/classroomSession/" + classroomSessionId, evt);
        schedulerDo(runnable);
    }

    /**
     * 广播：结束课堂
     *
     * @param classroomSessionId
     */
    public void endClassroomSession(Integer classroomSessionId) {
        WsEvent evt = new WsEvent(WsEvent.TYPE_END_CLASSROOM_SESSION,
                null,
                System.currentTimeMillis());
        Runnable runnable = () -> template.convertAndSend("/topic/classroomSession/" + classroomSessionId, evt);
        schedulerDo(runnable);
        // 删除所有学生连接信息
        removeStudentFromClassroomSession(classroomSessionId);
    }

    private void removeStudentFromClassroomSession(Integer classroomSessionId) {
        classroomSessionStudents.remove(classroomSessionId);
    }

    public void addStudentToClassroomSession(ClassroomMessage message) {
        classroomSessionStudents.computeIfAbsent(message.getClassroomSessionId(),
                k -> new CopyOnWriteArraySet<>())
                .add(message.getStudentId());
    }

    /**
     * 广播：学生提交作业
     *
     * @param classroomSessionId
     */
    public void submitWork(Integer classroomSessionId) {
        WsEvent evt = new WsEvent(WsEvent.TYPE_SUBMIT_WORK,
                null,
                System.currentTimeMillis());
        Runnable runnable = () -> template.convertAndSend("/topic/classroomSession/" + classroomSessionId, evt);
        schedulerDo(runnable);
    }
}
