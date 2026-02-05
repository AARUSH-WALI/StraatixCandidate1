import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowLeft, Building2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { LoginPromptModal } from '@/components/jobs/LoginPromptModal';

interface Job {
  id: string;
  title: string;
  location: string;
  job_type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      if (!id) return;

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle();

      if (!error && data) {
        setJob(data);
      }
      setLoading(false);
    }

    fetchJob();
  }, [id]);

  useEffect(() => {
    async function checkApplication() {
      if (!user || !id) return;

      const { data } = await supabase
        .from('applications')
        .select('id')
        .eq('user_id', user.id)
        .eq('job_id', id)
        .maybeSingle();

      setHasApplied(!!data);
    }

    checkApplication();
  }, [user, id]);

  const handleApplyClick = () => {
    if (!user) {
      setShowLoginPrompt(true);
    } else {
      // Navigate to dedicated apply page instead of modal
      navigate(`/jobs/${id}/apply`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-2xl font-semibold mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-8">
            This position may no longer be available.
          </p>
          <Button onClick={() => navigate('/jobs')}>View All Jobs</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <div className="gradient-hero">
          <div className="container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={() => navigate('/jobs')}
                className="flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Jobs
              </button>

              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-slate-200">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {job.job_type}
                  </Badge>
                </span>
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Straatix Partners
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 space-y-8"
            >
              <section>
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  About the Role
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
              </section>

              {job.responsibilities && job.responsibilities.length > 0 && (
                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                    Key Responsibilities
                  </h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {job.requirements && job.requirements.length > 0 && (
                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {job.requirements.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-gold mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 bg-card rounded-xl border border-border p-6 shadow-card">
                <h3 className="font-display font-semibold text-foreground mb-4">
                  Ready to Apply?
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Submit your application today and take the next step in your career journey.
                </p>

                {hasApplied ? (
                  <div className="text-center py-4">
                    <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                    <p className="text-sm font-medium text-success">Application Submitted</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      We'll be in touch soon!
                    </p>
                  </div>
                ) : (
                  <Button
                    className="w-full bg-gold hover:bg-gold-light text-accent-foreground font-semibold"
                    onClick={handleApplyClick}
                  >
                    Apply Now
                  </Button>
                )}

                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="text-sm font-medium text-foreground mb-3">Share this job</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      LinkedIn
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <LoginPromptModal
        open={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        jobId={job.id}
      />
    </Layout>
  );
}
