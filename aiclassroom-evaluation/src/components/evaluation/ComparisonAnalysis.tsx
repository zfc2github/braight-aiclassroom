import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GitCompare, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ComparisonItem } from '@/types/evaluation';

interface ComparisonAnalysisProps {
  comparison: ComparisonItem[];
}

const consistencyIcons = {
  '高度一致': CheckCircle2,
  '完全一致': CheckCircle2,
  '基本一致': CheckCircle2,
  '部分一致': AlertCircle,
};

export default function ComparisonAnalysis({ comparison }: ComparisonAnalysisProps) {
  return (
    <Card className="border-2 border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <GitCompare className="w-6 h-6" />
          授课现场与教学设计对比分析
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {comparison.map((item) => {
          const Icon = consistencyIcons[item.consistency as keyof typeof consistencyIcons] || AlertCircle;
          
          return (
            <div key={item.aspect} className="p-6 border border-border space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-foreground text-lg">{item.aspect}</h4>
                <span className="px-4 py-1 border-2 border-foreground text-sm font-medium flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {item.consistency}
                </span>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="p-4 border-l-4 border-foreground">
                  <p className="text-sm font-medium mb-2">教学设计</p>
                  <p className="text-foreground">{item.design}</p>
                </div>
                
                <div className="p-4 border-l-4 border-muted-foreground">
                  <p className="text-sm font-medium mb-2">实际授课</p>
                  <p className="text-foreground">{item.actual}</p>
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="p-6 border-2 border-border">
          <h4 className="font-semibold text-foreground mb-3">优化建议</h4>
          <p className="text-foreground leading-relaxed">
            整体来看，授课现场与教学设计的一致性较好，教师能够按照预设的教学计划开展教学。
            建议在今后的教学中，进一步优化时间分配，确保各环节时间充足；
            同时，在互动设计方面，可以更加注重高阶思维问题的设计，提升学生的思维深度。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
