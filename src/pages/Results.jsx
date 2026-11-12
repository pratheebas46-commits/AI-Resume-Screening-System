import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import PageHeader from '@/components/shared/PageHeader';
import ScoreRing from '@/components/shared/ScoreRing';
import SkillBadge from '@/components/shared/SkillBadge';
import { JOB_ROLES } from '@/lib/skillsData';

export default function Results() {
  const [filterRole, setFilterRole] = useState('all');
  const queryClient = useQueryClient();

  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => base44.entities.Resume.list('-score', 200),
  });

  const filtered = resumes
    .filter(r => r.status === 'completed')
    .filter(r => filterRole === 'all' || r.job_role === filterRole)
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const handleDelete = async (id) => {
    await base44.entities.Resume.delete(id);
    queryClient.invalidateQueries({ queryKey: ['resumes'] });
  };

  const downloadCSV = () => {
    const headers = ['Rank', 'Name', 'Email', 'Job Role', 'Score', 'Matched Skills', 'Missing Skills'];
    const rows = filtered.map((r, i) => [
      i + 1,
      r.candidate_name,
      r.email || '',
      r.job_role,
      r.score,
      (r.matched_skills || []).join('; '),
      (r.missing_skills || []).join('; ')
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-[60vh]"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Results" description={`${filtered.length} candidates ranked by match score`}>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {JOB_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        {filtered.length > 0 && (
          <Button variant="outline" onClick={downloadCSV}>
            <Download className="w-4 h-4 mr-2" /> CSV
          </Button>
        )}
      </PageHeader>

      {filtered.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No results yet. Upload resumes to get started.</p>
            <Link to="/upload"><Button className="mt-4">Upload Resumes</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((r, i) => (
            <Card key={r.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 md:p-5">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-lg font-bold text-muted-foreground w-8 text-center">#{i + 1}</span>
                    <ScoreRing score={r.score || 0} size={56} strokeWidth={4} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{r.candidate_name}</h3>
                        <p className="text-sm text-muted-foreground">{r.job_role} • {r.email}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Link to={`/resume/${r.id}`}>
                          <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                        </Link>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(r.id)}>
                          <Trash2 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(r.matched_skills || []).slice(0, 5).map(s => (
                        <SkillBadge key={s} skill={s} variant="matched" />
                      ))}
                      {(r.missing_skills || []).slice(0, 3).map(s => (
                        <SkillBadge key={s} skill={s} variant="missing" />
                      ))}
                      {((r.matched_skills?.length || 0) + (r.missing_skills?.length || 0)) > 8 && (
                        <span className="text-xs text-muted-foreground self-center">+more</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}