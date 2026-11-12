import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { GitCompare } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import ScoreRing from '@/components/shared/ScoreRing';
import SkillBadge from '@/components/shared/SkillBadge';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export default function Compare() {
  const [selected, setSelected] = useState([]);

  const { data: resumes = [] } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => base44.entities.Resume.list('-score', 200),
  });

  const completed = resumes.filter(r => r.status === 'completed');
  const candidates = selected.map(id => completed.find(r => r.id === id)).filter(Boolean);

  const addCandidate = (id) => {
    if (selected.length < 3 && !selected.includes(id)) {
      setSelected([...selected, id]);
    }
  };

  const removeCandidate = (id) => {
    setSelected(selected.filter(s => s !== id));
  };

  // Skills overlap matrix
  const allSkills = [...new Set(candidates.flatMap(c => [...(c.matched_skills || []), ...(c.missing_skills || [])]))];

  // Score breakdown chart data
  const chartData = candidates.length > 0 ? [
    { metric: 'Overall Score', ...Object.fromEntries(candidates.map((c, i) => [`c${i}`, c.score || 0])) },
    { metric: 'Skills Match', ...Object.fromEntries(candidates.map((c, i) => [`c${i}`, Math.round(((c.matched_skills?.length || 0) / ((c.matched_skills?.length || 0) + (c.missing_skills?.length || 0) || 1)) * 100)])) },
    { metric: 'Skills Count', ...Object.fromEntries(candidates.map((c, i) => [`c${i}`, (c.skills?.length || 0) * 5])) },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Compare Candidates" description="Compare 2 or 3 candidates side by side" />

      <Card className="border-0 shadow-sm mb-6">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Select candidates to compare (max 3)</label>
              <Select onValueChange={addCandidate} value="">
                <SelectTrigger>
                  <SelectValue placeholder="Add a candidate..." />
                </SelectTrigger>
                <SelectContent>
                  {completed.filter(r => !selected.includes(r.id)).map(r => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.candidate_name} — {r.score}% ({r.job_role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selected.length > 0 && (
              <Button variant="outline" onClick={() => setSelected([])}>Clear All</Button>
            )}
          </div>

          {candidates.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {candidates.map((c, i) => (
                <span key={c.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{ backgroundColor: COLORS[i] + '20', color: COLORS[i] }}>
                  {c.candidate_name}
                  <button onClick={() => removeCandidate(c.id)} className="hover:opacity-70">×</button>
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {candidates.length >= 2 && (
        <>
          {/* Score comparison */}
          <div className={`grid gap-4 mb-6 ${candidates.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {candidates.map((c, i) => (
              <Card key={c.id} className="border-0 shadow-sm" style={{ borderTop: `3px solid ${COLORS[i]}` }}>
                <CardContent className="p-5 text-center">
                  <ScoreRing score={c.score || 0} size={80} strokeWidth={5} />
                  <h3 className="font-semibold mt-3">{c.candidate_name}</h3>
                  <p className="text-xs text-muted-foreground">{c.job_role}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-emerald-500/10 rounded-lg p-2">
                      <span className="font-bold text-emerald-600">{c.matched_skills?.length || 0}</span>
                      <p className="text-muted-foreground">Matched</p>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-2">
                      <span className="font-bold text-red-600">{c.missing_skills?.length || 0}</span>
                      <p className="text-muted-foreground">Missing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Score breakdown chart */}
          <Card className="border-0 shadow-sm mb-6">
            <CardHeader><CardTitle className="text-base">Score Breakdown</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  {candidates.map((c, i) => (
                    <Bar key={c.id} dataKey={`c${i}`} name={c.candidate_name} fill={COLORS[i]} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Skills overlap matrix */}
          <Card className="border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">Skills Overlap Matrix</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium">Skill</th>
                      {candidates.map((c, i) => (
                        <th key={c.id} className="p-2 font-medium text-center" style={{ color: COLORS[i] }}>
                          {c.candidate_name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allSkills.map(skill => (
                      <tr key={skill} className="border-b border-border/50">
                        <td className="p-2 text-muted-foreground">{skill}</td>
                        {candidates.map(c => {
                          const has = (c.matched_skills || []).includes(skill) || (c.skills || []).includes(skill);
                          return (
                            <td key={c.id} className="p-2 text-center">
                              {has ? (
                                <span className="inline-block w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 text-xs leading-6">✓</span>
                              ) : (
                                <span className="inline-block w-6 h-6 rounded-full bg-red-500/10 text-red-400 text-xs leading-6">✗</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {candidates.length < 2 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <GitCompare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select at least 2 candidates</h3>
            <p className="text-muted-foreground">Choose 2 or 3 candidates from the dropdown to compare them side by side</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}