import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Send } from 'lucide-react';
import { toast } from "sonner";
import PageHeader from '@/components/shared/PageHeader';
import { cn } from "@/lib/utils";

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('general');
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: feedbacks = [] } = useQuery({
    queryKey: ['feedbacks'],
    queryFn: () => base44.entities.Feedback.list('-created_date', 50),
  });

  const submit = async () => {
    if (rating === 0) { toast.error("Please select a rating"); return; }
    if (!comment.trim()) { toast.error("Please enter a comment"); return; }

    setSubmitting(true);
    await base44.entities.Feedback.create({ rating, comment: comment.trim(), category });
    queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
    setRating(0);
    setComment('');
    setCategory('general');
    setSubmitting(false);
    toast.success("Thank you for your feedback!");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader title="Feedback" description="Help us improve the AI Resume Screening System" />

      <Card className="border-0 shadow-sm mb-8">
        <CardContent className="p-6 space-y-5">
          <div>
            <label className="text-sm font-medium mb-2 block">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(i)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star className={cn(
                    "w-7 h-7 transition-colors",
                    i <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                  )} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="improvement">Improvement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Comment</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
            />
          </div>

          <Button onClick={submit} disabled={submitting}>
            <Send className="w-4 h-4 mr-2" /> Submit Feedback
          </Button>
        </CardContent>
      </Card>

      {feedbacks.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader><CardTitle className="text-base">Recent Feedback</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {feedbacks.map(fb => (
              <div key={fb.id} className="p-4 rounded-lg bg-accent">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className={cn("w-3.5 h-3.5", i <= fb.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20")} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">{fb.category}</span>
                </div>
                <p className="text-sm text-foreground">{fb.comment}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}