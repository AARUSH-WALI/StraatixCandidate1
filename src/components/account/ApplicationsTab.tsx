import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Loader2, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Application {
  id: string;
  status: string;
  applied_at: string;
  job_id: string;
  job: {
    title: string;
    location: string;
    job_type: string;
  };
}

export function ApplicationsTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    async function fetchApplications() {
      if (!user) return;

      const { data } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          applied_at,
          job_id,
          job:jobs(title, location, job_type)
        `)
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });

      if (data) {
        setApplications(data as any);
      }
      setLoading(false);
    }

    fetchApplications();
  }, [user]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'Applied': 'bg-blue-100 text-blue-700',
      'Under Review': 'bg-yellow-100 text-yellow-700',
      'Shortlisted': 'bg-green-100 text-green-700',
      'Interview Scheduled': 'bg-purple-100 text-purple-700',
      'Rejected': 'bg-red-100 text-red-700',
      'Hired': 'bg-emerald-100 text-emerald-700',
    };
    return variants[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="font-display">My Applications</CardTitle>
        <CardDescription>
          Track the status of all your job applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No Applications Yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Start exploring job opportunities and submit your first application.
            </p>
            <Link to="/jobs">
              <Button>Browse Open Positions</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="border rounded-lg p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">
                      {app.job?.title || 'Unknown Position'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {app.job?.location || 'Location not specified'} •{' '}
                      {app.job?.job_type || 'Not specified'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Applied on{' '}
                      {new Date(app.applied_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusBadge(app.status)}>{app.status}</Badge>
                    <Link to={`/jobs/${app.job_id}`}>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
                        View Job
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
