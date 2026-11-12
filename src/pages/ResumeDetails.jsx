import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, GraduationCap, Briefcase, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import ScoreRing from '@/components/shared/ScoreRing';
import SkillBadge from '@/components/shared/SkillBadge';

export default function ResumeDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const resumeId = window.location.pathname.split('/').pop();
  const navigate = useNavigate();

  const { data: resumes = [], isLoading } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => base44.entities.Resume.list('-created_date', 200),
  });

  const resume = resumes.find(r => r.id === resumeId);

  if (isLoading) {
    return <div className="flex items-center justify-center h-[60vh]"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>;
  }

  if (!resume) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-muted-foreground">Resume not found</p>
        <Link to="/results"><Button className="mt-4">Back to Results</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
        <ScoreRing score={resume.score || 0} size={100} strokeWidth={6} />
        <div>
          <h1 className="text-2xl font-bold">{resume.candidate_name}</h1>
          <p className="text-muted-foreground">{resume.job_role}</p>
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
            {resume.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {resume.email}</span>}
            {resume.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {resume.phone}</span>}
          </div>
          {resume.file_url && (
            <a href={resume.file_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="mt-3">
                <ExternalLink className="w-3 h-3 mr-2" /> View Original
              </Button>
            </a>
          )}
        </div>
      </div>

      {resume.summary && (
        <Card className="border-0 shadow-sm mb-6">
          <CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground leading-relaxed">{resume.summary}</p></CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Education</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground">{resume.education || 'Not specified'}</p></CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Briefcase className="w-4 h-4" /> Experience</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground">{resume.experience || 'Not specified'}</p></CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm mb-6">
        <CardHeader><CardTitle className="text-base text-emerald-600">Matched Skills ({resume.matched_skills?.length || 0})</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(resume.matched_skills || []).map(s => <SkillBadge key={s} skill={s} variant="matched" />)}
            {(!resume.matched_skills || resume.matched_skills.length === 0) && <p className="text-sm text-muted-foreground">None</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm mb-6">
        <CardHeader><CardTitle className="text-base text-red-600">Missing Skills ({resume.missing_skills?.length || 0})</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(resume.missing_skills || []).map(s => <SkillBadge key={s} skill={s} variant="missing" />)}
            {(!resume.missing_skills || resume.missing_skills.length === 0) && <p className="text-sm text-muted-foreground">None</p>}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-base">All Extracted Skills</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(resume.skills || []).map(s => <SkillBadge key={s} skill={s} />)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}