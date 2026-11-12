import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, User, Save } from 'lucide-react';
import { toast } from "sonner";
import PageHeader from '@/components/shared/PageHeader';

export default function Settings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => { setUser(u); setLoading(false); });
  }, []);

  const handleLogout = () => {
    base44.auth.logout('/');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-[60vh]"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Settings" description="Manage your account" />

      <Card className="border-0 shadow-sm mb-6">
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><User className="w-4 h-4" /> Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Full Name</label>
            <Input value={user?.full_name || ''} disabled className="bg-muted" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <Input value={user?.email || ''} disabled className="bg-muted" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Role</label>
            <Input value={user?.role || 'user'} disabled className="bg-muted capitalize" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm border-destructive/20">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-4">Sign out of your account</p>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}