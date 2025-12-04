import { cn } from '@/lib/utils';
import { BookOpen, BarChart3, MessageSquare, ListChecks, GitCompare, Award, Users } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'overview', label: '报告概览', icon: BookOpen },
  { id: 'dimensions', label: '四维评估', icon: BarChart3 },
  { id: 'timeline', label: '时间分析', icon: ListChecks },
  { id: 'questions', label: '提问分析', icon: MessageSquare },
  { id: 'knowledge', label: '知识点总结', icon: ListChecks },
  { id: 'comparison', label: '对比分析', icon: GitCompare },
  { id: 'interaction', label: '互动分析', icon: Users },
  { id: 'feedback', label: '综合反馈', icon: Award },
];

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar-background border-r-2 border-sidebar-border overflow-y-auto">
      <div className="p-6 border-b-2 border-sidebar-border">
        <h1 className="font-bold text-sidebar-foreground mb-2 text-[18px]">中国中小学教学评估系统</h1>
        <h2 className="text-lg font-semibold text-sidebar-foreground"></h2>
      </div>
      <nav className="px-3 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 mb-2 transition-all border-2',
                activeSection === item.id
                  ? 'bg-foreground text-background border-foreground font-medium'
                  : 'text-sidebar-foreground border-sidebar-border hover:border-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-6 border-t-2 border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/70 text-center">
          © 2025 中国中小学教学评估系统
        </p>
      </div>
    </aside>
  );
}
