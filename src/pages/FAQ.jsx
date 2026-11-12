import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from '@/components/shared/PageHeader';

const faqs = [
  {
    q: "What file formats are supported for resume upload?",
    a: "We accept PDF, DOC, and DOCX files only. Any other file format will be rejected with the message 'Only resume files are allowed'."
  },
  {
    q: "How does the AI scoring work?",
    a: "Our AI analyzes your resume by extracting text, identifying skills through NLP, and comparing them against the required skills for the selected job role. The score (0-100%) reflects how well your skills match the job requirements using similarity matching techniques."
  },
  {
    q: "Can I upload multiple resumes at once?",
    a: "Yes! You can upload multiple resume files at once. Each resume will be processed individually and scored against the selected job role."
  },
  {
    q: "What information is extracted from my resume?",
    a: "The AI extracts: candidate name, email, phone number, technical skills, education details, work experience, and generates a professional summary."
  },
  {
    q: "How are candidates ranked?",
    a: "Candidates are ranked by their match score in descending order. The score is based on how many required skills for the job role are found in the resume, along with the depth of experience and education relevance."
  },
  {
    q: "Can I compare multiple candidates?",
    a: "Yes! The Compare page allows you to compare 2 or 3 candidates side by side, with score breakdown charts and a skills overlap matrix."
  },
  {
    q: "What are the recommended skills?",
    a: "The Recommendations page shows the top skills needed for each job role, along with curated courses and video tutorials to help candidates upskill."
  },
  {
    q: "Can I download the results?",
    a: "Yes, you can download all results as a CSV file from the Results page, including candidate names, scores, matched skills, and missing skills."
  },
  {
    q: "Is my resume data secure?",
    a: "Yes, all uploaded resumes are processed securely. Your data is stored in your account and is not shared with other users."
  },
  {
    q: "How can I provide feedback?",
    a: "Visit the Feedback page to rate the system and leave comments. Your feedback helps us improve the platform."
  }
];

export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="FAQ" description="Frequently asked questions about the AI Resume Screening System" />

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-sm font-medium text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}