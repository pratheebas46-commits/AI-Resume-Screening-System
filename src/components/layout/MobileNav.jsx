import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Upload, ListOrdered, GitCompare, 
  Lightbulb, MessageCircle, MessageSquare, Settings, 
  HelpCircle, Menu, X, Brain
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

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm">AI Resume</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 top-14 bg-background z-40 p-4 overflow-y-auto">
          <nav className="space-y-1">
            {navItems.map(({ icon: Icon, label, path }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}