import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Target } from 'lucide-react';
import type { DimensionScore } from '@/types/evaluation';

interface DimensionsChartProps {
  dimensions: DimensionScore[];
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export default function DimensionsChart({ dimensions }: DimensionsChartProps) {
  const chartData = dimensions.map((dim, index) => ({
    subject: dim.name,
    得分率: parseFloat(((dim.score / dim.maxScore) * 100).toFixed(1)),
    score: dim.score,
    maxScore: dim.maxScore,
    fullMark: 100,
    color: COLORS[index % COLORS.length],
  }));

  const totalScore = dimensions.reduce((sum, dim) => sum + dim.score, 0);
  const totalMaxScore = dimensions.reduce((sum, dim) => sum + dim.maxScore, 0);
  const percentage = ((totalScore / totalMaxScore) * 100).toFixed(1);

  return (
    <Card className="border-2 border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Target className="w-6 h-6" />
          四维评估量表
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid 
                  stroke="hsl(var(--border))" 
                  strokeWidth={1}
                />
                <PolarAngleAxis 
                  dataKey="subject" 
                  stroke="hsl(var(--foreground))"
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 500 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  stroke="hsl(var(--border))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                />
                <Radar
                  name="得分率"
                  dataKey="得分率"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
                <Tooltip 
                  formatter={(value: number) => `${value}%`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '4px',
                  }}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-4">
            <div className="border-2 border-foreground p-6 text-center">
              <p className="text-sm mb-2 text-muted-foreground">综合得分</p>
              <p className="text-4xl font-bold text-foreground">{totalScore}</p>
              <p className="text-sm mt-2 text-muted-foreground">满分 {totalMaxScore} 分</p>
              <p className="text-2xl font-semibold mt-2 text-foreground">{percentage}%</p>
            </div>
            
            <div className="space-y-3">
              {dimensions.map((dim, index) => (
                <div key={dim.name} className="p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 border border-foreground"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium text-foreground">{dim.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {dim.score}/{dim.maxScore}
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2">
                    <div
                      className="h-2 transition-all"
                      style={{
                        width: `${(dim.score / dim.maxScore) * 100}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
