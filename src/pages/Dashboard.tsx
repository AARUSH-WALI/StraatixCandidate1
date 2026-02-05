import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Briefcase, User, ArrowRight, CheckCircle, MapPin, Clock, Building2, ChevronRight, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface Profile {
  full_name: string;
  email: string;
  phone?: string;
  primary_resume_url?: string;
  degree_institution?: string;
}

interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  salary_range: string;
  created_at: string;
}

interface Application {
  id: string;
  status: string;
  applied_at: string;
  job: {
    title: string;
    location: string;
  };
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?mode=login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      // Define promises for parallel execution
      const profilePromise = supabase
        .from('candidate_profiles')
        .select('full_name, email, phone, primary_resume_url, degree_institution')
        .eq('user_id', user.id)
        .maybeSingle();

      const applicationsPromise = supabase
        .from('applications')
        .select(`
          id,
          status,
          applied_at,
          job:jobs(title, location)
        `)
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false })
        .limit(5);

      const jobsPromise = supabase
        .from('jobs')
        .select('id, title, location, type, salary_range, created_at')
        .eq('status', 'Active')
        .order('created_at', { ascending: false })
        .limit(3);

      // Execute all promises concurrently
      const [profileResult, applicationsResult, jobsResult] = await Promise.all([
        profilePromise,
        applicationsPromise,
        jobsPromise
      ]);

      // Handle Profile Result
      if (profileResult.data) {
        setProfile(profileResult.data);
      }

      // Handle Applications Result
      if (applicationsResult.data) {
        setApplications(applicationsResult.data as any);
      }

      // Handle Jobs Result with Fallback
      if (jobsResult.data && jobsResult.data.length > 0) {
        setRecommendedJobs(jobsResult.data as any);
      } else {
        // Fallback: get recent jobs regardless of status if no active ones found
        const { data: allJobs } = await supabase
          .from('jobs')
          .select('id, title, location, type, salary_range, created_at')
          .order('created_at', { ascending: false })
          .limit(3);

        if (allJobs) setRecommendedJobs(allJobs as any);
      }

      setLoading(false);
    }

    fetchData();
  }, [user]);

  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    const fields = ['full_name', 'email', 'phone', 'primary_resume_url', 'degree_institution'];
    const filled = fields.filter((f) => profile[f as keyof Profile]).length;
    return Math.round((filled / fields.length) * 100);
  };

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

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background">
          {/* Hero Skeleton */}
          <div className="gradient-hero py-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/20 to-transparent" />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-gold/10 blur-3xl" />
            </div>
            <div className="container mx-auto px-4 relative z-10">
              <Skeleton className="h-10 w-64 mb-2 bg-white/20" />
              <Skeleton className="h-6 w-96 bg-white/10" />
            </div>
          </div>

          <div className="container mx-auto px-4 py-8">
            {/* Stats Cards Skeleton */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
            {/* Recommended Jobs Skeleton */}
            <div className="mb-10">
              <div className="flex justify-between mb-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-24" />
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const profileCompletion = calculateProfileCompletion();

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="gradient-hero py-8 relative overflow-hidden">
          {/* Background Pattern - Visual Polish */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/20 to-transparent" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-gold/10 blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
                Welcome back, {profile?.full_name?.split(' ')[0] || 'Candidate'}!
              </h1>
              <p className="text-slate-300 mt-1">
                Manage your profile and track your applications
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid md:grid-cols-3 gap-6 mb-8"
          >
            <Card className="border-border/50 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Profile Completion
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Progress value={profileCompletion} className="flex-1" />
                  <span className="text-2xl font-bold">{profileCompletion}%</span>
                </div>
                {profileCompletion < 100 && (
                  <Button
                    variant="link"
                    className="p-0 h-auto mt-2 text-sm"
                    onClick={() => navigate('/account')}
                  >
                    Complete your profile →
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Applications
                </CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{applications.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Track all your job applications
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Resume Status
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {profile?.primary_resume_url ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-sm font-medium text-success">Uploaded</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-sm text-muted-foreground">No resume uploaded</span>
                    <Button
                      variant="link"
                      className="p-0 h-auto block text-sm"
                      onClick={() => navigate('/account?tab=resume')}
                    >
                      Upload now →
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommended Jobs Section - NEW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-gold fill-gold" />
                <h2 className="font-display text-xl font-semibold">Recommended for You</h2>
              </div>
              <Button
                variant="ghost"
                onClick={() => navigate('/jobs')}
                className="text-sm text-primary hover:text-primary/80"
              >
                View All Jobs
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {recommendedJobs.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {recommendedJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                  >
                    <Card
                      className="h-full border-border/50 shadow-card hover:shadow-card-hover transition-all cursor-pointer group"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="mb-4">
                          <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {job.title}
                          </h3>
                          <div className="flex items-center text-muted-foreground mt-2 text-sm">
                            <Building2 className="h-3.5 w-3.5 mr-1.5" />
                            <span>Straatix Partner</span>
                          </div>
                        </div>

                        <div className="space-y-2 mb-6 flex-grow">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 mr-2 shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Briefcase className="h-3.5 w-3.5 mr-2 shrink-0" />
                            <span className="truncate">{job.type}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 mr-2 shrink-0" />
                            <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <Button
                          className="w-full bg-secondary/50 text-foreground hover:bg-gold hover:text-accent-foreground transition-colors"
                          variant="outline"
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="border-border/50 shadow-card border-dashed">
                <CardContent className="py-12 text-center">
                  <Briefcase className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No recommended jobs found at the moment.</p>
                  <Button variant="link" onClick={() => navigate('/jobs')}>
                    Browse all active positions
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Recent Applications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold">Recent Applications</h2>
              <Button
                variant="ghost"
                onClick={() => navigate('/account?tab=applications')}
                className="text-sm"
              >
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {applications.length === 0 ? (
              <Card className="border-border/50 shadow-card">
                <CardContent className="py-12 text-center">
                  <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No Applications Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start exploring opportunities and apply to jobs that match your profile.
                  </p>
                  <Button onClick={() => navigate('/jobs')}>
                    Browse Open Positions
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {applications.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="border-border/50 shadow-card hover:shadow-card-hover transition-shadow">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-foreground">
                              {app.job?.title || 'Unknown Position'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {app.job?.location || 'Location not specified'} • Applied{' '}
                              {new Date(app.applied_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <Badge className={getStatusBadge(app.status)}>
                            {app.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 grid md:grid-cols-2 gap-4"
          >
            <Card
              className="border-border/50 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
              onClick={() => navigate('/jobs')}
            >
              <CardContent className="py-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Explore Jobs</h3>
                  <p className="text-sm text-muted-foreground">
                    Find your next career opportunity
                  </p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>

            <Card
              className="border-border/50 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
              onClick={() => navigate('/account')}
            >
              <CardContent className="py-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Update Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Keep your information current
                  </p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
