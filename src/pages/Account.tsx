import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, GraduationCap, FileText, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { PersonalDetailsTab } from '@/components/account/PersonalDetailsTab';
import { AcademicDetailsTab } from '@/components/account/AcademicDetailsTab';
import { ResumeTab } from '@/components/account/ResumeTab';
import { ApplicationsTab } from '@/components/account/ApplicationsTab';

export default function Account() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'personal');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?mode=login');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-background">
          <div className="gradient-hero py-8">
            <div className="container mx-auto px-4">
              <Skeleton className="h-10 w-48 mb-2 bg-white/20" />
              <Skeleton className="h-6 w-64 bg-white/10" />
            </div>
          </div>
          <div className="container mx-auto px-4 py-8">
            <Skeleton className="h-12 w-full max-w-2xl mb-6" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="gradient-hero py-8">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
                Manage Account
              </h1>
              <p className="text-slate-300 mt-1">
                Update your profile information and preferences
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-secondary/50">
                <TabsTrigger value="personal" className="flex items-center gap-2 py-3">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Personal</span>
                </TabsTrigger>
                <TabsTrigger value="academic" className="flex items-center gap-2 py-3">
                  <GraduationCap className="h-4 w-4" />
                  <span className="hidden sm:inline">Academic</span>
                </TabsTrigger>
                <TabsTrigger value="resume" className="flex items-center gap-2 py-3">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Resume</span>
                </TabsTrigger>
                <TabsTrigger value="applications" className="flex items-center gap-2 py-3">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Applications</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <PersonalDetailsTab />
              </TabsContent>

              <TabsContent value="academic">
                <AcademicDetailsTab />
              </TabsContent>

              <TabsContent value="resume">
                <ResumeTab />
              </TabsContent>

              <TabsContent value="applications">
                <ApplicationsTab />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
