import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, TrendingUp, Lightbulb } from 'lucide-react';
import type { Advantage, Suggestion } from '@/types/evaluation';

interface FeedbackSummaryProps {
  advantages: Advantage[];
  suggestions: Suggestion[];
  overallComment: string;
}

export default function FeedbackSummary({ advantages, suggestions, overallComment }: FeedbackSummaryProps) {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Award className="w-6 h-6" />
            总体评语
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="p-6 border-2 border-foreground">
            <p className="text-foreground leading-relaxed text-lg">{overallComment}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-2 border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="w-6 h-6" />
            突出优势
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {advantages.map((advantage, index) => (
              <div key={index} className="p-6 border-l-4 border-foreground">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-foreground text-background border border-foreground flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  {advantage.title}
                </h4>
                <p className="text-foreground leading-relaxed">{advantage.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-2 border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Lightbulb className="w-6 h-6" />
            改进建议
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-6 border-l-4 border-muted-foreground">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 bg-muted-foreground text-background border border-muted-foreground flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  {suggestion.title}
                </h4>
                <p className="text-foreground leading-relaxed">{suggestion.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
