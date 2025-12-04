import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, BookOpen, Users, Calendar, Clock } from 'lucide-react';
import type { TeacherInfo } from '@/types/evaluation';

interface TeacherInfoCardProps {
  info: TeacherInfo;
}

export default function TeacherInfoCard({ info }: TeacherInfoCardProps) {
  return (
    <Card className="border-2 border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <User className="w-6 h-6" />
          教师基本信息
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 border border-border rounded">
            <User className="w-5 h-5 text-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">授课教师</p>
              <p className="font-semibold text-foreground">{info.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 border border-border rounded">
            <BookOpen className="w-5 h-5 text-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">授课内容</p>
              <p className="font-semibold text-foreground">{info.subject}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 border border-border rounded">
            <Users className="w-5 h-5 text-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">授课班级</p>
              <p className="font-semibold text-foreground">{info.class}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 border border-border rounded">
            <Calendar className="w-5 h-5 text-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">评估日期</p>
              <p className="font-semibold text-foreground">{info.date}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 border border-border rounded">
            <Clock className="w-5 h-5 text-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">观察时间</p>
              <p className="font-semibold text-foreground">{info.observationTime}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 border border-border rounded">
            <Clock className="w-5 h-5 text-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">总时长</p>
              <p className="font-semibold text-foreground">{info.totalDuration} 分钟</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
