import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Brain, Lightbulb } from 'lucide-react';
import type { KnowledgePoint } from '@/types/evaluation';

interface KnowledgePointsProps {
  points: KnowledgePoint[];
}

const categoryIcons = {
  '语言知识与技能': BookOpen,
  '阅读策略与方法': Brain,
  '人文内涵与思维发展': Lightbulb,
};

export default function KnowledgePoints({ points }: KnowledgePointsProps) {
  return (
    <Card className="border-2 border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <BookOpen className="w-6 h-6" />
          课程知识点总结
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {points.map((point) => {
          const Icon = categoryIcons[point.category as keyof typeof categoryIcons] || BookOpen;
          
          return (
            <div key={point.category} className="p-6 border-l-4 border-foreground">
              <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2 text-lg">
                <Icon className="w-5 h-5" />
                {point.category}
              </h4>
              <ul className="space-y-3">
                {point.items.map((item, index) => (
                  <li key={index} className="flex gap-3 items-start">
                    <span className="font-bold mt-1">•</span>
                    <span className="text-foreground leading-relaxed flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        
        <div className="p-6 border-2 border-border">
          <h4 className="font-semibold text-foreground mb-3">PISA阅读素养体现</h4>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="p-4 border border-border">
              <p className="font-medium text-foreground mb-2">信息获取</p>
              <p className="text-sm text-muted-foreground">引导学生从文本中提取关键信息</p>
            </div>
            <div className="p-4 border border-border">
              <p className="font-medium text-foreground mb-2">文本理解</p>
              <p className="text-sm text-muted-foreground">培养学生深入理解文本内涵</p>
            </div>
            <div className="p-4 border border-border">
              <p className="font-medium text-foreground mb-2">元认知策略</p>
              <p className="text-sm text-muted-foreground">帮助学生反思阅读过程和方法</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
