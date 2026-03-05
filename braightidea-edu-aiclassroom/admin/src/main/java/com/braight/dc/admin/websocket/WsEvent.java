package com.braight.dc.admin.websocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Shine
 * @date 2026/1/15
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WsEvent {
    private String type;
    private Object payload;
    private Long timestamp;

    public static final String JOIN_CLASS = "join-class";
    public static final String START_TOOL_EXPERIENCE = "start-tool-experience";
    public static final String TYPE_START_QUIZ = "start-quiz";
    public static final String TYPE_SUBMIT_QUIZ = "submit-quiz";
    public static final String TYPE_END_CLASSROOM_SESSION = "end-classroom-session";
    public static final String TYPE_SUBMIT_WORK = "submit-work";
}
