import React, { useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload as UploadIcon, FileText, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/shared/PageHeader';
import { JOB_ROLES, ROLE_SKILLS } from '@/lib/skillsData';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [jobRole, setJobRole] = useState('');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const validateFile = (file) => {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(ext)) {
      return "Only resume files are allowed";
    }
    return null;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer?.files || []);
    addFiles(droppedFiles);
  }, []);

  const addFiles = (newFiles) => {
    const validated = newFiles.map(file => {
      const error = validateFile(file);
      return { file, error, id: Math.random().toString(36).substr(2, 9) };
    });
    setFiles(prev => [...prev, ...validated]);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const isValidResume = (analysis) => {
    // Must have at least name, some contact info, skills, education or experience
    const hasName = analysis.candidate_name && analysis.candidate_name.trim().length > 1 && analysis.candidate_name !== 'Unknown';
    const hasContact = (analysis.email && analysis.email.includes('@')) || (analysis.phone && analysis.phone.length >= 7);
    const hasSkills = analysis.skills && analysis.skills.length > 0;
    const hasEduOrExp = (analysis.education && analysis.education.trim().length > 5) || (analysis.experience && analysis.experience.trim().length > 5);
    return hasName && hasContact && hasSkills && hasEduOrExp;
  };

  const processResumes = async () => {
    const validFiles = files.filter(f => !f.error);
    if (validFiles.length === 0) {
      toast.error("No valid files to process");
      return;
    }
    if (!jobRole) {
      toast.error("Please select a job role");
      return;
    }

    setProcessing(true);
    setResults([]);
    const newResults = [];

    for (const { file, id } of validFiles) {
      setResults(prev => [...prev, { id, name: file.name, status: 'uploading' }]);

      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      setResults(prev => prev.map(r => r.id === id ? { ...r, status: 'analyzing' } : r));

      const roleSkills = ROLE_SKILLS[jobRole] || [];
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this document for the "${jobRole}" position and determine if it is a valid resume/CV.

A valid resume must contain ALL of the following:
- Candidate's full name
- Contact information (email address AND/OR phone number)
- Skills or technical competencies
- Education details (degree, institution)
- Work experience or projects

If the document does NOT contain these resume elements (e.g., it's a random document, image, form, invoice, article, etc.), set is_valid_resume to false.

If it IS a valid resume, extract:
1. Full name of the candidate
2. Email address
3. Phone number
4. List of technical skills found
5. Education details
6. Experience summary
7. A brief professional summary

The required skills for this role are: ${roleSkills.join(', ')}

Compare the candidate's skills with the required skills and calculate a match score (0-100).
Skills that match go in matched_skills, missing role skills go in missing_skills.`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            is_valid_resume: { type: "boolean" },
            candidate_name: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            skills: { type: "array", items: { type: "string" } },
            matched_skills: { type: "array", items: { type: "string" } },
            missing_skills: { type: "array", items: { type: "string" } },
            education: { type: "string" },
            experience: { type: "string" },
            summary: { type: "string" },
            score: { type: "number" }
          }
        }
      });

      // Validate: AI says it's not a resume, OR extracted data is insufficient
      if (!analysis.is_valid_resume || !isValidResume(analysis)) {
        setResults(prev => prev.map(r => r.id === id ? {
          ...r,
          status: 'invalid',
          errorMsg: 'Invalid resume: document must contain name, contact info, skills, education, and experience.'
        } : r));
        continue;
      }

      const resume = await base44.entities.Resume.create({
        candidate_name: analysis.candidate_name || 'Unknown',
        email: analysis.email || '',
        phone: analysis.phone || '',
        job_role: jobRole,
        file_url,
        file_name: file.name,
        skills: analysis.skills || [],
        matched_skills: analysis.matched_skills || [],
        missing_skills: analysis.missing_skills || [],
        score: Math.min(100, Math.max(0, analysis.score || 0)),
        education: analysis.education || '',
        experience: analysis.experience || '',
        summary: analysis.summary || '',
        status: 'completed'
      });

      setResults(prev => prev.map(r => r.id === id ? { ...r, status: 'done', resume } : r));
      newResults.push(resume);
    }

    queryClient.invalidateQueries({ queryKey: ['resumes'] });
    setProcessing(false);
    if (newResults.length > 0) toast.success(`${newResults.length} resume(s) processed successfully!`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader title="Upload Resumes" description="Upload PDF, DOC, or DOCX resume files for AI analysis" />

      <Card className="border-0 shadow-sm mb-6">
        <CardContent className="p-6">
          <label className="block mb-4">
            <span className="text-sm font-medium mb-2 block">Target Job Role</span>
            <Select value={jobRole} onValueChange={setJobRole}>
              <SelectTrigger className="w-full max-w-sm">
                <SelectValue placeholder="Select a job role..." />
              </SelectTrigger>
              <SelectContent>
                {JOB_ROLES.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('file-input').click()}
            className="border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <UploadIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-medium mb-1">Drop files here or click to browse</p>
            <p className="text-sm text-muted-foreground">PDF, DOC, DOCX only</p>
            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => addFiles(Array.from(e.target.files || []))}
            />
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map(({ file, error, id }) => (
                <div key={id} className={`flex items-center gap-3 p-3 rounded-lg ${error ? 'bg-red-500/10' : 'bg-accent'}`}>
                  <FileText className={`w-4 h-4 shrink-0 ${error ? 'text-red-500' : 'text-muted-foreground'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    {error && <p className="text-xs text-red-500">{error}</p>}
                  </div>
                  <button onClick={() => removeFile(id)} className="p-1 hover:bg-background rounded">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={processResumes}
            disabled={processing || !jobRole || files.filter(f => !f.error).length === 0}
            className="mt-6 w-full sm:w-auto"
            size="lg"
          >
            {processing ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
            ) : (
              <><UploadIcon className="w-4 h-4 mr-2" /> Analyze Resumes</>
            )}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Processing Results</h3>
            <div className="space-y-3">
              {results.map(r => (
                <div key={r.id} className={`flex items-center gap-3 p-3 rounded-lg ${r.status === 'invalid' ? 'bg-red-500/10' : 'bg-accent'}`}>
                  {r.status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
                  {r.status === 'analyzing' && <Loader2 className="w-4 h-4 animate-spin text-amber-500" />}
                  {r.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {r.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                  {r.status === 'invalid' && <AlertCircle className="w-4 h-4 text-red-500" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className={`text-xs ${r.status === 'invalid' ? 'text-red-500 font-medium' : 'text-muted-foreground'}`}>
                      {r.status === 'uploading' && 'Uploading...'}
                      {r.status === 'analyzing' && 'AI is analyzing the resume...'}
                      {r.status === 'done' && `✓ Valid resume — Score: ${r.resume?.score}%`}
                      {r.status === 'error' && 'Error processing'}
                      {r.status === 'invalid' && (r.errorMsg || 'Invalid resume: missing required fields (name, contact, skills, education, experience)')}
                    </p>
                  </div>
                  {r.status === 'done' && (
                    <Button size="sm" variant="ghost" onClick={() => navigate(`/resume/${r.resume.id}`)}>View</Button>
                  )}
                </div>
              ))}
            </div>
            {!processing && results.every(r => ['done', 'invalid', 'error'].includes(r.status)) && results.some(r => r.status === 'done') && (
              <Button onClick={() => navigate('/results')} className="mt-4" variant="outline">
                View All Results
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}