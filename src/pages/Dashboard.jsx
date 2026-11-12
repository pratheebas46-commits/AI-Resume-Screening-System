import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, FileText, TrendingUp, Award } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import ScoreRing from '@/components/shared/ScoreRing';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function Dashboard() {
  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => base44.entities.Resume.list('-created_date', 100),
  });

  const completed = resumes.filter(r => r.status === 'completed');
  const avgScore = completed.length ? Math.round(completed.reduce((s, r) => s + (r.score || 0), 0) / completed.length) : 0;
  const topCandidate = completed.sort((a, b) => (b.score || 0) - (a.score || 0))[0];

  // Skills frequency
  const skillFreq = {};
  completed.forEach(r => {
    (r.matched_skills || []).forEach(s => { skillFreq[s] = (skillFreq[s] || 0) + 1; });
  });
  const skillData = Object.entries(skillFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  // Score distribution
  const scoreBuckets = [
    { range: '0-20', count: 0 }, { range: '21-40', count: 0 },
    { range: '41-60', count: 0 }, { range: '61-80', count: 0 }, { range: '81-100', count: 0 }
  ];
  completed.forEach(r => {
    const s = r.score || 0;
    if (s <= 20) scoreBuckets[0].count++;
    else if (s <= 40) scoreBuckets[1].count++;
    else if (s <= 60) scoreBuckets[2].count++;
    else if (s <= 80) scoreBuckets[3].count++;
    else scoreBuckets[4].count++;
  });

  const stats = [
    { label: 'Total Resumes', value: resumes.length, icon: FileText, color: 'text-blue-500' },
    { label: 'Processed', value: completed.length, icon: Users, color: 'text-emerald-500' },
    { label: 'Avg Score', value: `${avgScore}%`, icon: TrendingUp, color: 'text-amber-500' },
    { label: 'Top Score', value: topCandidate ? `${topCandidate.score}%` : 'N/A', icon: Award, color: 'text-purple-500' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader title="Dashboard" description="Overview of your resume screening activity" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {completed.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
            <p className="text-muted-foreground mb-4">Upload resumes to see analytics</p>
            <Link to="/upload">
              <Button>Upload Resumes</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Top Skills Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={skillData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {skillData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={scoreBuckets}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Top Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {completed.slice(0, 6).map((r, i) => (
                  <Link key={r.id} to={`/resume/${r.id}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent transition-colors">
                    <ScoreRing score={r.score || 0} size={52} strokeWidth={4} />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{r.candidate_name}</p>
                      <p className="text-xs text-muted-foreground">{r.job_role}</p>
                      <p className="text-xs text-muted-foreground">Rank #{i + 1}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}