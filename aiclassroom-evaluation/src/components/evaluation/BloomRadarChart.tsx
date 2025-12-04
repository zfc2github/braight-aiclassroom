import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { MessageSquare } from 'lucide-react';
import type { BloomQuestion } from '@/types/evaluation';

interface BloomRadarChartProps {
  questions: BloomQuestion[];
  analysis: {
    strengths: string[];
    improvements: string[];
  };
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(0 0% 45%)'];

export default function BloomRadarChart({ questions, analysis }: BloomRadarChartProps) {
  return (
    <Card className="border-2 border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <MessageSquare className="w-6 h-6" />
          布鲁姆目标分类学提问分析
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={questions}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ level, count }) => `${level} ${count}个`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count"
                  strokeWidth={2}
                  stroke="hsl(var(--border))"
                >
                  {questions.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {questions.map((q, index) => (
              <div key={q.level} className="p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 border border-foreground"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-foreground">{q.level}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {q.count} 个 ({q.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-muted h-2">
                  <div
                    className="h-2 transition-all"
                    style={{ 
                      width: `${q.percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="p-6 border-l-4 border-foreground">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <span>✓</span>
              优势展示
            </h4>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="text-foreground leading-relaxed flex gap-2">
                  <span className="font-bold">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-6 border-l-4 border-muted-foreground">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <span>⚡</span>
              改进建议
            </h4>
            <ul className="space-y-2">
              {analysis.improvements.map((improvement, index) => (
                <li key={index} className="text-foreground leading-relaxed flex gap-2">
                  <span className="font-bold">•</span>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
