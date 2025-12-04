import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock } from 'lucide-react';
import type { TimeSegment } from '@/types/evaluation';

interface TimelineChartProps {
  segments: TimeSegment[];
  analysis: string;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function TimelineChart({ segments, analysis }: TimelineChartProps) {
  return (
    <Card className="border-2 border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Clock className="w-6 h-6" />
          教学过程时间分析
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={segments}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="activity" stroke="hsl(var(--foreground))" />
              <YAxis label={{ value: '时长（分钟）', angle: -90, position: 'insideLeft' }} stroke="hsl(var(--foreground))" />
              <Tooltip />
              <Bar dataKey="duration" stroke="hsl(var(--border))" strokeWidth={2}>
                {segments.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 xl:grid-cols-7 gap-4">
          {segments.map((segment, index) => (
            <div key={segment.activity} className="p-4 border border-border text-center">
              <div
                className="w-4 h-4 mx-auto mb-2 border border-foreground"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <p className="text-sm font-medium text-foreground mb-1">{segment.activity}</p>
              <p className="text-2xl font-bold text-foreground">{segment.duration}</p>
              <p className="text-xs text-muted-foreground">分钟</p>
              <p className="text-sm font-semibold text-foreground mt-1">{segment.percentage.toFixed(1)}%</p>
            </div>
          ))}
        </div>
        
        <div className="p-6 border-2 border-border">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            时间控制总体评价
          </h4>
          <p className="text-foreground leading-relaxed">{analysis}</p>
        </div>
      </CardContent>
    </Card>
  );
}
