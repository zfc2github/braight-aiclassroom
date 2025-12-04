import { useState } from 'react';
import Sidebar from '@/components/evaluation/Sidebar';
import TeacherInfoCard from '@/components/evaluation/TeacherInfoCard';
import DimensionsChart from '@/components/evaluation/DimensionsChart';
import TimelineChart from '@/components/evaluation/TimelineChart';
import BloomRadarChart from '@/components/evaluation/BloomRadarChart';
import KnowledgePoints from '@/components/evaluation/KnowledgePoints';
import ComparisonAnalysis from '@/components/evaluation/ComparisonAnalysis';
import FeedbackSummary from '@/components/evaluation/FeedbackSummary';
import InteractionAnalysisReport from '@/components/evaluation/InteractionAnalysisReport';
import { mockEvaluationData } from '@/data/mockData';

export default function EvaluationReport() {
  const [activeSection, setActiveSection] = useState('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <TeacherInfoCard info={mockEvaluationData.teacherInfo} />
            <FeedbackSummary
              advantages={mockEvaluationData.advantages}
              suggestions={mockEvaluationData.suggestions}
              overallComment={mockEvaluationData.overallComment}
            />
          </div>
        );
      case 'dimensions':
        return <DimensionsChart dimensions={mockEvaluationData.dimensions} />;
      case 'timeline':
        return (
          <TimelineChart
            segments={mockEvaluationData.timeSegments}
            analysis={mockEvaluationData.timelineAnalysis}
          />
        );
      case 'questions':
        return (
          <BloomRadarChart
            questions={mockEvaluationData.bloomQuestions}
            analysis={mockEvaluationData.questionAnalysis}
          />
        );
      case 'knowledge':
        return <KnowledgePoints points={mockEvaluationData.knowledgePoints} />;
      case 'comparison':
        return <ComparisonAnalysis comparison={mockEvaluationData.comparison} />;
      case 'interaction':
        return mockEvaluationData.interactionAnalysis ? (
          <InteractionAnalysisReport analysis={mockEvaluationData.interactionAnalysis} />
        ) : (
          <div className="text-center text-muted-foreground">暂无互动分析数据</div>
        );
      case 'feedback':
        return (
          <FeedbackSummary
            advantages={mockEvaluationData.advantages}
            suggestions={mockEvaluationData.suggestions}
            overallComment={mockEvaluationData.overallComment}
          />
        );
      default:
        return (
          <div className="space-y-6">
            <TeacherInfoCard info={mockEvaluationData.teacherInfo} />
            <FeedbackSummary
              advantages={mockEvaluationData.advantages}
              suggestions={mockEvaluationData.suggestions}
              overallComment={mockEvaluationData.overallComment}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
