package com.braight.dc.admin.websocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

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

    /**
     * 广播：开始实验通知
     *
     * @param classroomSessionId
     */
    public void startToolExperience(Integer classroomSessionId) {
        WsEvent evt = new WsEvent(WsEvent.START_TOOL_EXPERIENCE,
                null,
                System.currentTimeMillis());
        template.convertAndSend("/topic/classroomSession/" + classroomSessionId, evt);
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
        template.convertAndSend("/topic/classroomSession/" + classroomSessionId, evt);
    }

    /**
     * 广播：结束测验通知
     *
     * @param classroomSessionId
     */
    public void endQuiz(Integer classroomSessionId) {
        WsEvent evt = new WsEvent(WsEvent.TYPE_END_QUIZ,
                null,
                System.currentTimeMillis());
        template.convertAndSend("/topic/classroomSession/" + classroomSessionId, evt);
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
        template.convertAndSend("/topic/classroomSession/" + classroomSessionId, evt);
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
}
