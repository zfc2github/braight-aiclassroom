// 教师评估报告类型定义

export interface TeacherInfo {
  name: string;
  subject: string;
  class: string;
  date: string;
  observationTime: string;
  totalDuration: number;
}

export interface DimensionScore {
  name: string;
  weight: number;
  score: number;
  maxScore: number;
}

export interface TimeSegment {
  activity: string;
  duration: number;
  percentage: number;
}

export interface BloomQuestion {
  level: string;
  count: number;
  percentage: number;
}

export interface KnowledgePoint {
  category: string;
  items: string[];
}

export interface Advantage {
  title: string;
  description: string;
}

export interface Suggestion {
  title: string;
  description: string;
}

export interface ComparisonItem {
  aspect: string;
  design: string;
  actual: string;
  consistency: string;
}

export interface InteractionData {
  teacherLanguage: number;
  studentLanguage: number;
  silentTime: number;
  tsrRatio: number;
  studentInitiativeRate: number;
}

export interface ClassroomPhase {
  timeRange: string;
  phase: string;
  characteristics: string[];
  studentBehavior: string[];
  metrics?: {
    teacherTalk: number;
    studentResponse: number;
    attention: number;
    participation: number;
    handRaising: number;
  };
}

export interface InteractionAnalysis {
  summary: string;
  fiasOverview: InteractionData;
  classroomPhases: ClassroomPhase[];
  teacherInteraction: {
    advantages: string[];
    improvements: string[];
  };
  studentParticipation: {
    advantages: string[];
    limitations: string[];
  };
  studentBehaviorAnalysis?: {
    handRaising: {
      peaks: { time: string; description: string }[];
      valleys: { time: string; description: string }[];
      conclusion: string;
      teachingImplication: string[];
    };
    attention: {
      highPeriods: { time: string; description: string }[];
      lowPeriods: { time: string; description: string }[];
      conclusion: string;
      teachingImplication: string[];
    };
    participation: {
      highPeriods: { time: string; description: string }[];
      lowPeriods: { time: string; description: string }[];
      conclusion: string;
      teachingImplication: string[];
    };
    detailedMetrics: {
      time: string;
      handRaising: number;
      attention: number;
      participation: number;
    }[];
  };
  recommendations: {
    title: string;
    strategy: string;
  }[];
}

export interface EvaluationReport {
  teacherInfo: TeacherInfo;
  dimensions: DimensionScore[];
  timeSegments: TimeSegment[];
  bloomQuestions: BloomQuestion[];
  knowledgePoints: KnowledgePoint[];
  advantages: Advantage[];
  suggestions: Suggestion[];
  comparison: ComparisonItem[];
  overallComment: string;
  timelineAnalysis: string;
  questionAnalysis: {
    strengths: string[];
    improvements: string[];
  };
  interactionAnalysis?: InteractionAnalysis;
}
