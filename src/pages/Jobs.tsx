import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Briefcase, SlidersHorizontal } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { JobCard } from '@/components/jobs/JobCard';
import { JobFilters } from '@/components/jobs/JobFilters';
import { JobAnalytics } from '@/components/jobs/JobAnalytics';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface Job {
  id: string;
  title: string;
  location: string;
  job_type: string;
  job_function: string;
  description: string;
  minimum_experience: number;
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter states
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedFunctions, setSelectedFunctions] = useState<string[]>([]);
  const [experienceRange, setExperienceRange] = useState<number[]>([0]); // Default to 0 for slider logic
  const [isExperienceFilterEnabled, setIsExperienceFilterEnabled] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    async function fetchJobs() {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, location, job_type, job_function, description, minimum_experience')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Handle job_function being null for older rows
        const jobsWithFunction = data.map(job => ({
          ...job,
          job_function: job.job_function || 'General',
          minimum_experience: job.minimum_experience || 0
        }));
        setJobs(jobsWithFunction);
      }
      setLoading(false);
    }

    fetchJobs();
  }, []);

  // Get unique locations from jobs
  const availableLocations = useMemo(() => {
    return [...new Set(jobs.map(job => job.location.split(',')[0].trim()))];
  }, [jobs]);

  // Filter jobs based on all criteria
  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query)
      );
    }

    // Job type filter
    if (selectedJobTypes.length > 0) {
      filtered = filtered.filter((job) => selectedJobTypes.includes(job.job_type));
    }

    // Location filter
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((job) => {
        const jobCity = job.location.split(',')[0].trim();
        return selectedLocations.some(loc =>
          job.location.toLowerCase().includes(loc.toLowerCase()) ||
          jobCity === loc
        );
      });
    }

    // Job function filter
    if (selectedFunctions.length > 0) {
      filtered = filtered.filter((job) => selectedFunctions.includes(job.job_function));
    }

    // Experience filter (only if enabled)
    if (isExperienceFilterEnabled) {
      filtered = filtered.filter((job) => job.minimum_experience <= experienceRange[0]);
    }

    return filtered;
  }, [jobs, searchQuery, selectedJobTypes, selectedLocations, selectedFunctions, experienceRange, isExperienceFilterEnabled]);

  const hasActiveFilters = selectedJobTypes.length > 0 || selectedLocations.length > 0 || selectedFunctions.length > 0 || isExperienceFilterEnabled;

  const clearAllFilters = () => {
    setSelectedJobTypes([]);
    setSelectedLocations([]);
    setSelectedFunctions([]);
    setExperienceRange([0]);
    setIsExperienceFilterEnabled(false);
    setSearchQuery('');
  };

  const FilterPanel = () => (
    <JobFilters
      selectedJobTypes={selectedJobTypes}
      onJobTypesChange={setSelectedJobTypes}
      selectedLocations={selectedLocations}
      onLocationsChange={setSelectedLocations}
      selectedFunctions={selectedFunctions}
      onFunctionsChange={setSelectedFunctions}
      experienceRange={experienceRange}
      onExperienceChange={setExperienceRange}
      isExperienceFilterEnabled={isExperienceFilterEnabled}
      onExperienceFilterToggle={setIsExperienceFilterEnabled}
      availableLocations={availableLocations}
      onClearAll={clearAllFilters}
      hasActiveFilters={hasActiveFilters}
    />
  );

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="gradient-hero py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Open Positions
              </h1>
              <p className="text-slate-200 max-w-2xl mx-auto">
                Discover exciting career opportunities with our client partners.
                Find the perfect role that matches your skills and aspirations.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="container mx-auto px-4 -mt-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-xl border border-border p-4 shadow-card"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by job title, location, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {/* Mobile filter button */}
              <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {hasActiveFilters && (
                      <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                        {selectedJobTypes.length + selectedLocations.length + selectedFunctions.length + (isExperienceFilterEnabled ? 1 : 0)}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="p-4">
                    <FilterPanel />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Analytics Section */}
          {!loading && jobs.length > 0 && (
            <JobAnalytics jobs={jobs} />
          )}

          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24">
                <FilterPanel />
              </div>
            </aside>

            {/* Job Listings */}
            <div className="flex-1">
              {loading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-6 rounded-xl bg-card border border-border/50">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ))}
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-16">
                  <Briefcase className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                    No positions found
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {hasActiveFilters || searchQuery
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Check back soon for new opportunities!'}
                  </p>
                  {(hasActiveFilters || searchQuery) && (
                    <Button variant="outline" onClick={clearAllFilters}>
                      Clear all filters
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-6">
                    Showing {filteredJobs.length} position{filteredJobs.length !== 1 ? 's' : ''}
                    {hasActiveFilters && ' (filtered)'}
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredJobs.map((job, index) => (
                      <JobCard key={job.id} job={job} index={index} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
