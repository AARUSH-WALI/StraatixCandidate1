import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Form } from '@/components/ui/form';
import { ApplicationStepper } from '@/components/jobs/ApplicationStepper';
import { PersonalInfoStep } from '@/components/jobs/apply-steps/PersonalInfoStep';
import { ProfessionalStep } from '@/components/jobs/apply-steps/ProfessionalStep';
import { DocumentsStep } from '@/components/jobs/apply-steps/DocumentsStep';
import { ReviewStep } from '@/components/jobs/apply-steps/ReviewStep';

const applicationSchema = z.object({
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    date_of_birth: z.string().min(1, 'Date of birth is required'),
    nationality: z.string().min(1, 'Nationality is required'),
    gender: z.string().min(1, 'Gender is required'),
    address: z.string().min(1, 'Address is required'),
    class_x_school: z.string().min(1, 'Class X School is required'),
    class_x_year: z.string().min(1, 'Class X Year is required'),
    class_x_percentage: z.string().min(1, 'Class X Percentage is required'),
    class_xii_school: z.string().min(1, 'Class XII School is required'),
    class_xii_year: z.string().min(1, 'Class XII Year is required'),
    class_xii_percentage: z.string().min(1, 'Class XII Percentage is required'),
    degree_institution: z.string().min(1, 'Degree Institution is required'),
    degree_name: z.string().min(1, 'Degree Name is required'),
    degree_year: z.string().min(1, 'Degree Year is required'),
    degree_cgpa: z.string().min(1, 'Degree CGPA is required'),
    current_company: z.string().optional(),
    current_ctc: z.string().optional(),
    expected_ctc: z.string().optional(),
    save_to_profile: z.boolean().default(true),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface Job {
    id: string;
    title: string;
    location: string;
    job_type: string;
}

const STEPS = [
    { id: 1, title: 'Personal Info', description: 'Basic details' },
    { id: 2, title: 'Professional', description: 'Experience & education' },
    { id: 3, title: 'Documents', description: 'Resume upload' },
    { id: 4, title: 'Review', description: 'Final check' },
];

export default function Apply() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const form = useForm<ApplicationFormData>({
        resolver: zodResolver(applicationSchema),
        defaultValues: {
            phone: '',
            date_of_birth: '',
            nationality: '',
            gender: '',
            address: '',
            class_x_school: '',
            class_x_year: '',
            class_x_percentage: '',
            class_xii_school: '',
            class_xii_year: '',
            class_xii_percentage: '',
            degree_institution: '',
            degree_name: '',
            degree_year: '',
            degree_cgpa: '',
            current_company: '',
            current_ctc: '',
            expected_ctc: '',
            save_to_profile: true,
        },
    });

    // Fetch job details
    useEffect(() => {
        async function fetchJob() {
            if (!id) return;

            const { data, error } = await supabase
                .from('jobs')
                .select('id, title, location, job_type')
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

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            navigate(`/auth?mode=login&redirect=/jobs/${id}/apply`);
        }
    }, [user, authLoading, navigate, id]);

    // Fetch user profile
    useEffect(() => {
        async function fetchProfile() {
            if (!user) return;

            const { data } = await supabase
                .from('candidate_profiles')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (data) {
                setProfile(data);
                form.reset({
                    phone: data.phone || '',
                    date_of_birth: data.date_of_birth || '',
                    nationality: data.nationality || '',
                    gender: data.gender || '',
                    address: data.address || '',
                    class_x_school: data.class_x_school || '',
                    class_x_year: data.class_x_year?.toString() || '',
                    class_x_percentage: data.class_x_percentage?.toString() || '',
                    class_xii_school: data.class_xii_school || '',
                    class_xii_year: data.class_xii_year?.toString() || '',
                    class_xii_percentage: data.class_xii_percentage?.toString() || '',
                    degree_institution: data.degree_institution || '',
                    degree_name: data.degree_name || '',
                    degree_year: data.degree_year?.toString() || '',
                    degree_cgpa: data.degree_cgpa?.toString() || '',
                    current_company: data.current_company || '',
                    current_ctc: data.current_ctc?.toString() || '',
                    expected_ctc: data.expected_ctc?.toString() || '',
                    save_to_profile: true,
                });
            }
        }

        fetchProfile();
    }, [user, form]);

    // Check if already applied
    useEffect(() => {
        async function checkApplication() {
            if (!user || !id) return;

            const { data } = await supabase
                .from('applications')
                .select('id')
                .eq('user_id', user.id)
                .eq('job_id', id)
                .maybeSingle();

            if (data) {
                setSubmitted(true);
            }
        }

        checkApplication();
    }, [user, id]);

    const handleNext = async () => {
        // Validate current step
        let valid = false;

        if (currentStep === 1) {
            // Personal Info Step
            valid = await form.trigger([
                'phone',
                'date_of_birth',
                'nationality',
                'gender',
                'address'
            ]);
        } else if (currentStep === 2) {
            // Professional Step
            valid = await form.trigger([
                'class_x_school', 'class_x_year', 'class_x_percentage',
                'class_xii_school', 'class_xii_year', 'class_xii_percentage',
                'degree_institution', 'degree_name', 'degree_year', 'degree_cgpa'
            ]);
        } else if (currentStep === 3) {
            // Documents Step - Validate resume file presence
            if (!resumeFile && !profile?.primary_resume_url) {
                toast({
                    title: "Resume Required",
                    description: "Please upload your resume to continue.",
                    variant: "destructive"
                });
                valid = false;
            } else {
                valid = true;
            }
        } else {
            valid = true;
        }

        if (valid && currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleStepClick = (step: number) => {
        setCurrentStep(step);
    };

    const onSubmit = async (data: ApplicationFormData) => {
        if (!user || !job) return;

        setSubmitting(true);

        try {
            let resumeUrl = profile?.primary_resume_url || '';

            // Upload resume if provided
            if (resumeFile) {
                const fileName = `${user.id}/${Date.now()}-${resumeFile.name}`;
                console.log('Uploading resume:', fileName);

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('resumes')
                    .upload(fileName, resumeFile, {
                        cacheControl: '3600',
                        upsert: true
                    });

                if (uploadError) {
                    console.error('Resume upload error:', uploadError);
                    toast({
                        title: 'Resume Upload Failed',
                        description: uploadError.message || 'Failed to upload resume. Please check storage permissions.',
                        variant: 'destructive',
                    });
                    throw uploadError;
                }

                console.log('Resume uploaded successfully:', uploadData);

                const { data: urlData } = supabase.storage
                    .from('resumes')
                    .getPublicUrl(fileName);

                resumeUrl = urlData.publicUrl;
                console.log('Resume public URL:', resumeUrl);
            }

            // Save to profile if checked
            if (data.save_to_profile) {
                await supabase
                    .from('candidate_profiles')
                    .update({
                        phone: data.phone,
                        date_of_birth: data.date_of_birth || null,
                        nationality: data.nationality || null,
                        gender: data.gender || null,
                        address: data.address || null,
                        class_x_school: data.class_x_school || null,
                        class_x_year: data.class_x_year ? parseInt(data.class_x_year) : null,
                        class_x_percentage: data.class_x_percentage ? parseFloat(data.class_x_percentage) : null,
                        class_xii_school: data.class_xii_school || null,
                        class_xii_year: data.class_xii_year ? parseInt(data.class_xii_year) : null,
                        class_xii_percentage: data.class_xii_percentage ? parseFloat(data.class_xii_percentage) : null,
                        degree_institution: data.degree_institution || null,
                        degree_name: data.degree_name || null,
                        degree_year: data.degree_year ? parseInt(data.degree_year) : null,
                        degree_cgpa: data.degree_cgpa ? parseFloat(data.degree_cgpa) : null,
                        current_company: data.current_company || null,
                        current_ctc: data.current_ctc ? parseFloat(data.current_ctc) : null,
                        expected_ctc: data.expected_ctc ? parseFloat(data.expected_ctc) : null,
                        primary_resume_url: resumeUrl || null,
                    })
                    .eq('user_id', user.id);
            }

            // Create application with snapshot
            const { error: appError } = await supabase.from('applications').insert({
                user_id: user.id,
                job_id: job.id,
                snapshot_name: profile?.full_name || '',
                snapshot_email: profile?.email || user.email || '',
                snapshot_phone: data.phone,
                snapshot_date_of_birth: data.date_of_birth || null,
                snapshot_nationality: data.nationality || null,
                snapshot_gender: data.gender || null,
                snapshot_address: data.address || null,
                snapshot_class_x_school: data.class_x_school || null,
                snapshot_class_x_year: data.class_x_year ? parseInt(data.class_x_year) : null,
                snapshot_class_x_percentage: data.class_x_percentage ? parseFloat(data.class_x_percentage) : null,
                snapshot_class_xii_school: data.class_xii_school || null,
                snapshot_class_xii_year: data.class_xii_year ? parseInt(data.class_xii_year) : null,
                snapshot_class_xii_percentage: data.class_xii_percentage ? parseFloat(data.class_xii_percentage) : null,
                snapshot_degree_institution: data.degree_institution || null,
                snapshot_degree_name: data.degree_name || null,
                snapshot_degree_year: data.degree_year ? parseInt(data.degree_year) : null,
                snapshot_degree_cgpa: data.degree_cgpa ? parseFloat(data.degree_cgpa) : null,
                snapshot_current_company: data.current_company || null,
                snapshot_current_ctc: data.current_ctc ? parseFloat(data.current_ctc) : null,
                snapshot_expected_ctc: data.expected_ctc ? parseFloat(data.expected_ctc) : null,
                snapshot_resume_url: resumeUrl || null,
            });

            if (appError) throw appError;

            setSubmitted(true);
            toast({
                title: 'Application Submitted!',
                description: `Your application for ${job.title} has been submitted successfully.`,
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to submit application.',
                variant: 'destructive',
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || authLoading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <Skeleton className="h-8 w-48 mb-6" />
                    <Skeleton className="h-12 w-3/4 mb-4" />
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
                    <p className="text-muted-foreground mb-8">This position may no longer be available.</p>
                    <Button onClick={() => navigate('/jobs')}>View All Jobs</Button>
                </div>
            </Layout>
        );
    }

    if (submitted) {
        return (
            <Layout>
                <div className="min-h-[70vh] flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center max-w-md mx-auto px-4"
                    >
                        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="h-10 w-10 text-success" />
                        </div>
                        <h1 className="font-display text-2xl font-semibold text-foreground mb-3">
                            Application Submitted!
                        </h1>
                        <p className="text-muted-foreground mb-8">
                            Your application for <strong>{job.title}</strong> has been received.
                            We'll review your profile and get back to you soon.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button variant="outline" onClick={() => navigate('/jobs')}>
                                Browse More Jobs
                            </Button>
                            <Button onClick={() => navigate('/dashboard')}>
                                Go to Dashboard
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-background">
                {/* Header */}
                <div className="gradient-hero py-8">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <button
                            onClick={() => navigate(`/jobs/${id}`)}
                            className="flex items-center gap-2 text-slate-300 hover:text-white mb-4 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Job Details
                        </button>
                        <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
                            Apply for {job.title}
                        </h1>
                        <p className="text-slate-300 mt-1">
                            {job.location} • {job.job_type}
                        </p>
                    </div>
                </div>

                {/* Stepper */}
                <div className="container mx-auto px-4 max-w-4xl py-8">
                    <ApplicationStepper
                        steps={STEPS}
                        currentStep={currentStep}
                        onStepClick={handleStepClick}
                    />
                </div>

                {/* Form Content */}
                <div className="container mx-auto px-4 max-w-3xl pb-12">
                    <Form {...form}>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {currentStep === 1 && (
                                            <PersonalInfoStep
                                                form={form}
                                                profile={profile}
                                                userEmail={user?.email || ''}
                                            />
                                        )}
                                        {currentStep === 2 && <ProfessionalStep form={form} />}
                                        {currentStep === 3 && (
                                            <DocumentsStep
                                                resumeFile={resumeFile}
                                                onResumeChange={setResumeFile}
                                                existingResumeUrl={profile?.primary_resume_url}
                                            />
                                        )}
                                        {currentStep === 4 && (
                                            <ReviewStep
                                                form={form}
                                                profile={profile}
                                                userEmail={user?.email || ''}
                                                resumeFile={resumeFile}
                                                existingResumeUrl={profile?.primary_resume_url}
                                                onEditStep={handleStepClick}
                                                jobTitle={job.title}
                                            />
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation Buttons */}
                                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleBack}
                                        disabled={currentStep === 1}
                                        className="gap-2"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back
                                    </Button>

                                    {currentStep < STEPS.length ? (
                                        <Button type="button" onClick={handleNext} className="gap-2">
                                            Next
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            onClick={form.handleSubmit(onSubmit)}
                                            disabled={submitting}
                                            className="gap-2 bg-gold hover:bg-gold-light text-accent-foreground"
                                        >
                                            {submitting ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Submit Application'
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Layout>
    );
}
