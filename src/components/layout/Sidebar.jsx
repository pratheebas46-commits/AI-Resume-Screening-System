import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Upload, ListOrdered, GitCompare, 
  Lightbulb, MessageCircle, MessageSquare, Settings, 
  HelpCircle, ChevronLeft, ChevronRight, FileText,
  Brain
} from 'lucide-react';
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Upload, label: 'Upload', path: '/upload' },
  { icon: ListOrdered, label: 'Results', path: '/results' },
  { icon: GitCompare, label: 'Compare', path: '/compare' },
  { icon: Lightbulb, label: 'Recommendations', path: '/recommendations' },
  { icon: MessageCircle, label: 'AI Chat', path: '/chatbot' },
  { icon: MessageSquare, label: 'Feedback', path: '/feedback' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'FAQ', path: '/faq' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full bg-card border-r border-border z-40 flex flex-col transition-all duration-300",
      collapsed ? "w-[68px]" : "w-[240px]"
    )}>
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-bold text-base tracking-tight truncate">AI Resume</span>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="m-2 p-2 rounded-lg hover:bg-accent text-muted-foreground transition-colors flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}