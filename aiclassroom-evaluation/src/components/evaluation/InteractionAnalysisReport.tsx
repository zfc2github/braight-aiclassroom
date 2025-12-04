import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { Users } from 'lucide-react';
import type { InteractionAnalysis } from '@/types/evaluation';

interface InteractionAnalysisReportProps {
  analysis: InteractionAnalysis;
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export default function InteractionAnalysisReport({ analysis }: InteractionAnalysisReportProps) {
  const languageData = [
    { name: '教师语言', value: analysis.fiasOverview.teacherLanguage },
    { name: '学生语言', value: analysis.fiasOverview.studentLanguage },
    { name: '安静时间', value: analysis.fiasOverview.silentTime },
  ];

  const ratioData = [
    { name: '师生话语比', value: analysis.fiasOverview.tsrRatio },
    { name: '学生主动发言率', value: analysis.fiasOverview.studentInitiativeRate },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-2 border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Users className="w-6 h-6" />
            师生互动行为分析报告
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="p-6 border-l-4 border-foreground bg-muted/30">
              <h3 className="text-lg font-semibold text-foreground mb-3">报告摘要</h3>
              <p className="text-foreground leading-relaxed">{analysis.summary}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-foreground">一、整体互动结构与节奏分析</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-semibold text-foreground mb-4">1. 弗兰德斯互动分析概览</h4>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <div className="h-80">
                  <p className="text-sm font-medium text-foreground mb-3">师生话语比例分布</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={languageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} ${value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        strokeWidth={2}
                        stroke="hsl(var(--border))"
                      >
                        {languageData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-80">
                  <p className="text-sm font-medium text-foreground mb-3">互动质量指标</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ratioData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--foreground))"
                        tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                      />
                      <YAxis 
                        stroke="hsl(var(--foreground))"
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '4px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="value" fill="hsl(var(--chart-1))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-2 text-foreground">
                <p>• 师生话语比例：教师语言约占 {analysis.fiasOverview.teacherLanguage}%，学生语言约占 {analysis.fiasOverview.studentLanguage}%，安静或混乱时间约占 {analysis.fiasOverview.silentTime}%。</p>
                <p>• 师生话语比（TSR）：TSR = {analysis.fiasOverview.tsrRatio}（教师语言÷学生语言）。这意味着教师每说{analysis.fiasOverview.tsrRatio}句话，学生说1句话。</p>
                <p>• 互动模式：以"教师提问—学生回答—教师反馈"的IRE循环为主导，学生主动发言比例约为{analysis.fiasOverview.studentInitiativeRate}%。</p>
              </div>
            </div>

            <div>
              <h4 className="text-base font-semibold text-foreground mb-4">2. 课堂节奏的"波浪式"演进</h4>
              <p className="text-foreground mb-4">整节课的节奏清晰地呈现出 "前稳—中活—后沉" 的波浪式结构，这与教学内容的推进高度吻合。</p>
              
              <div className="mb-6">
                <p className="text-sm font-medium text-foreground mb-3">课堂互动节奏变化趋势</p>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={analysis.classroomPhases.map((phase, index) => ({
                        name: phase.timeRange,
                        教师讲述: phase.metrics?.teacherTalk || 0,
                        学生回答: phase.metrics?.studentResponse || 0,
                        注意力: (phase.metrics?.attention || 0) * 100,
                        参与度: (phase.metrics?.participation || 0) * 100,
                        举手率: (phase.metrics?.handRaising || 0) * 100,
                        order: index,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--foreground))"
                        tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
                        angle={-15}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        stroke="hsl(var(--foreground))"
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                        label={{ value: '百分比 (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--foreground))' }}
                      />
                      <Tooltip 
                        formatter={(value: number) => `${value.toFixed(1)}%`}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '4px',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="教师讲述"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="学生回答"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="注意力"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--chart-3))', r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="参与度"
                        stroke="hsl(var(--chart-4))"
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--chart-4))', r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="举手率"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: 'hsl(var(--chart-1))', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="space-y-4">
                {analysis.classroomPhases.map((phase, index) => (
                  <div key={index} className="p-4 border border-border">
                    <h5 className="font-semibold text-foreground mb-2">
                      {phase.timeRange}（{phase.phase}）
                    </h5>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">互动特征：</p>
                        <ul className="space-y-1">
                          {phase.characteristics.map((char, idx) => (
                            <li key={idx} className="text-foreground text-sm flex gap-2">
                              <span>•</span>
                              <span>{char}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">学生行为：</p>
                        <ul className="space-y-1">
                          {phase.studentBehavior.map((behavior, idx) => (
                            <li key={idx} className="text-foreground text-sm flex gap-2">
                              <span>•</span>
                              <span>{behavior}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-foreground">二、师生互动深度诊断</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-semibold text-foreground mb-4">1. 教师主导下的高效互动</h4>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="p-4 border-l-4 border-foreground">
                  <p className="text-sm font-semibold text-foreground mb-2">优势</p>
                  <ul className="space-y-2">
                    {analysis.teacherInteraction.advantages.map((adv, idx) => (
                      <li key={idx} className="text-foreground text-sm flex gap-2">
                        <span>•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 border-l-4 border-muted-foreground">
                  <p className="text-sm font-semibold text-foreground mb-2">改进空间</p>
                  <ul className="space-y-2">
                    {analysis.teacherInteraction.improvements.map((imp, idx) => (
                      <li key={idx} className="text-foreground text-sm flex gap-2">
                        <span>•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-base font-semibold text-foreground mb-4">2. 学生参与的质量与局限</h4>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="p-4 border-l-4 border-foreground">
                  <p className="text-sm font-semibold text-foreground mb-2">优势</p>
                  <ul className="space-y-2">
                    {analysis.studentParticipation.advantages.map((adv, idx) => (
                      <li key={idx} className="text-foreground text-sm flex gap-2">
                        <span>•</span>
                        <span>{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 border-l-4 border-muted-foreground">
                  <p className="text-sm font-semibold text-foreground mb-2">局限</p>
                  <ul className="space-y-2">
                    {analysis.studentParticipation.limitations.map((lim, idx) => (
                      <li key={idx} className="text-foreground text-sm flex gap-2">
                        <span>•</span>
                        <span>{lim}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {analysis.studentBehaviorAnalysis && (
              <div>
                <h4 className="text-base font-semibold text-foreground mb-4">3. 学生行为详细分析</h4>
                
                <div className="mb-6">
                  <p className="text-sm font-medium text-foreground mb-3">学生行为趋势对比图</p>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={analysis.studentBehaviorAnalysis.detailedMetrics.map((metric) => ({
                          name: metric.time,
                          举手率: metric.handRaising * 100,
                          注意力: metric.attention * 100,
                          参与度: metric.participation * 100,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="name" 
                          stroke="hsl(var(--foreground))"
                          tick={{ fill: 'hsl(var(--foreground))', fontSize: 10 }}
                          angle={-15}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis 
                          domain={[0, 100]}
                          stroke="hsl(var(--foreground))"
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                          label={{ value: '百分比 (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--foreground))' }}
                        />
                        <Tooltip 
                          formatter={(value: number) => `${value.toFixed(1)}%`}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '4px',
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="举手率"
                          stroke="hsl(var(--chart-1))"
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--chart-1))', r: 5 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="注意力"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--chart-2))', r: 5 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="参与度"
                          stroke="hsl(var(--chart-3))"
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--chart-3))', r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 border border-border">
                    <h5 className="font-semibold text-foreground mb-3">① 举手情况分析</h5>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">学生举手出现三个高峰：</p>
                        <ul className="space-y-2">
                          {analysis.studentBehaviorAnalysis.handRaising.peaks.map((peak, idx) => (
                            <li key={idx} className="text-foreground text-sm flex gap-2">
                              <span>•</span>
                              <span><strong>{peak.time}</strong>：{peak.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">两个明显低谷：</p>
                        <ul className="space-y-2">
                          {analysis.studentBehaviorAnalysis.handRaising.valleys.map((valley, idx) => (
                            <li key={idx} className="text-foreground text-sm flex gap-2">
                              <span>•</span>
                              <span><strong>{valley.time}</strong>：{valley.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-muted/30 border-l-4 border-foreground">
                        <p className="text-sm font-medium text-foreground mb-1">分析结论：</p>
                        <p className="text-foreground text-sm">{analysis.studentBehaviorAnalysis.handRaising.conclusion}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">教学意义：</p>
                        <ul className="space-y-1">
                          {analysis.studentBehaviorAnalysis.handRaising.teachingImplication.map((impl, idx) => (
                            <li key={idx} className="text-foreground text-sm flex gap-2">
                              <span>•</span>
                              <span>{impl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-border">
                    <h5 className="font-semibold text-foreground mb-3">② 学生专注度分析</h5>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">专注度整体较高的时段：</p>
                        <ul className="space-y-2">
                          {analysis.studentBehaviorAnalysis.attention.highPeriods.map((period, idx) => (
                            <li key={idx} className="text-foreground text-sm flex gap-2">
                              <span>•</span>
                              <span><strong>{period.time}</strong>：{period.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">专注度下降的时段：</p>
                        <ul className="space-y-2">
                          {analysis.studentBehaviorAnalysis.attention.lowPeriods.map((period, idx) => (
                            <li key={idx} className="text-foreground text-sm flex gap-2">
                              <span>•</span>
                              <span><strong>{period.time}</strong>：{period.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-muted/30 border-l-4 border-foreground">
                        <p className="text-sm font-medium text-foreground mb-1">分析结论：</p>
                        <p className="text-foreground text-sm">{analysis.studentBehaviorAnalysis.attention.conclusion}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">教学意义：</p>
                        <ul className="space-y-1">
                          {analysis.studentBehaviorAnalysis.attention.teachingImplication.map((impl, idx) => (
                            <li key={idx} className="text-foreground text-sm flex gap-2">
                              <span>•</span>
                              <span>{impl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-border">
                    <h5 className="font-semibold text-foreground mb-3">③ 学生参与度分析</h5>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">参与度最高的时段：</p>
                        <ul className="space-y-2">
                          {analysis.studentBehaviorAnalysis.participation.highPeriods.map((period, idx) => (
                            <li key={idx} className="text-foreground text-sm flex gap-2">
                              <span>•</span>
                              <span><strong>{period.time}</strong>：{period.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">参与度下降的时段：</p>
                        <ul className="space-y-2">
                          {analysis.studentBehaviorAnalysis.participation.lowPeriods.map((period, idx) => (
                            <li key={idx} className="text-foreground text-sm flex gap-2">
                              <span>•</span>
                              <span><strong>{period.time}</strong>：{period.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-muted/30 border-l-4 border-foreground">
                        <p className="text-sm font-medium text-foreground mb-1">分析结论：</p>
                        <p className="text-foreground text-sm">{analysis.studentBehaviorAnalysis.participation.conclusion}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">教学意义：</p>
                        <ul className="space-y-1">
                          {analysis.studentBehaviorAnalysis.participation.teachingImplication.map((impl, idx) => (
                            <li key={idx} className="text-foreground text-sm flex gap-2">
                              <span>•</span>
                              <span>{impl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-foreground">三、综合结论与教学建议</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="p-6 border-l-4 border-foreground bg-muted/30">
              <h4 className="text-base font-semibold text-foreground mb-3">总体评价</h4>
              <p className="text-foreground leading-relaxed">
                本节课是一节设计精致、互动充分、目标达成度高的优秀语文课。教师成功地将单元要素"感受生动的语言，积累喜欢的语句"融入教学全程，通过清晰的节奏控制和多样化的任务设计，实现了教师主导与学生主体的较好平衡。
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-foreground mb-4">精准教学改进建议</h4>
              <div className="space-y-4">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border border-border">
                    <h5 className="font-semibold text-foreground mb-2">
                      {index + 1}. {rec.title}
                    </h5>
                    <div className="pl-4">
                      <p className="text-sm font-medium text-foreground mb-1">策略：</p>
                      <p className="text-foreground text-sm leading-relaxed">{rec.strategy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border border-border bg-muted/20">
              <p className="text-xs text-muted-foreground italic">
                *报告编制依据：本报告分析基于弗兰德斯互动分析系统（FIAS）及结构化课堂观察数据，结合《义务教育语文课程标准》对"自主、合作、探究"学习方式的要求而形成。
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
