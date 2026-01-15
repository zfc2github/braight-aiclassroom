package com.braight.dc.admin.web.constants;

/**
 * @author Shine
 * @date 2026/1/15
 */
public class Constant {
    public static class ClassroomSessionCurrentStage {
        public static final String WAITING = "waiting";
        public static final String TOOL_EXPERIENCE = "tool-experience";
        public static final String QUIZ = "quiz";
        public static final String COMPLETED = "completed";

        private ClassroomSessionCurrentStage() {
        }

    }
    public static class ClassroomSessionStatus {
        public static final String ACTIVE = "active";
        public static final String ENDED = "ended";

        private ClassroomSessionStatus() {
        }

    }
}
