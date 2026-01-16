package com.braight.dc.admin.websocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * @author Shine
 * @date 2026/1/16
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassroomMessage {
    private String type; // 消息类型：JOIN, QUIZ_PUBLISH, CLASSROOM_END
    private Integer classroomSessionId;
    private String studentId;
    private String content;
    private LocalDateTime timestamp;

    public static final String TYPE_JOIN = "join";
}
