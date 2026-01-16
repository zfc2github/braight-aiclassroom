package com.braight.dc.admin.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

/**
 * @author Shine
 * @date 2026/1/15
 */
@Controller
public class WsController {
    @Autowired
    private WsService wsService;

    @MessageMapping("/classroomSession/join") // 对应 /app/classroomSession/join
    public void joinClassroomSession(ClassroomMessage message) {
        message.setType(ClassroomMessage.TYPE_JOIN);
        message.setTimestamp(LocalDateTime.now());
        // 保存学生连接信息
        wsService.addStudentToClassroomSession(message);

    }
}
