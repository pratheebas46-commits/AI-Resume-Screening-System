import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Video, Sparkles, ExternalLink } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import SkillBadge from '@/components/shared/SkillBadge';
import { JOB_ROLES, ROLE_SKILLS, ROLE_COURSES, ROLE_VIDEOS } from '@/lib/skillsData';

export default function Recommendations() {
  const [role, setRole] = useState('');

  const skills = role ? ROLE_SKILLS[role] || [] : [];
  const courses = role ? ROLE_COURSES[role] || [] : [];
  const videos = role ? ROLE_VIDEOS[role] || [] : [];

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader title="Recommendations" description="Skills, courses, and videos for your target role" />

      <Card className="border-0 shadow-sm mb-8">
        <CardContent className="p-6">
          <label className="text-sm font-medium mb-2 block">Select a Job Role</label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full max-w-sm">
              <SelectValue placeholder="Choose a role..." />
            </SelectTrigger>
            <SelectContent>
              {JOB_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {role && (
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Recommended Skills for {role}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map(s => <SkillBadge key={s} skill={s} />)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> Recommended Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {courses.map((c, i) => (
                  <a key={i} href={c.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-lg bg-accent hover:bg-accent/80 transition-colors group">
                    <div>
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">{c.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{c.platform}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" /> Recommended Videos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {videos.map((v, i) => (
                  <a key={i} href={v.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-lg bg-accent hover:bg-accent/80 transition-colors group">
                    <div>
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">{v.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{v.channel}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}