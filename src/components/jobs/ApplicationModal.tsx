import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const applicationSchema = z.object({
  phone: z.string().min(10, 'Please enter a valid phone number'),
  date_of_birth: z.string().optional(),
  nationality: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  class_x_school: z.string().optional(),
  class_x_year: z.string().optional(),
  class_x_percentage: z.string().optional(),
  class_xii_school: z.string().optional(),
  class_xii_year: z.string().optional(),
  class_xii_percentage: z.string().optional(),
  degree_institution: z.string().optional(),
  degree_name: z.string().optional(),
  degree_year: z.string().optional(),
  degree_cgpa: z.string().optional(),
  current_company: z.string().optional(),
  current_ctc: z.string().optional(),
  expected_ctc: z.string().optional(),
  save_to_profile: z.boolean().default(false),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationModalProps {
  open: boolean;
  onClose: () => void;
  job: { id: string; title: string };
  onSuccess: () => void;
}

export function ApplicationModal({ open, onClose, job, onSuccess }: ApplicationModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      phone: '',
      save_to_profile: true,
    },
  });

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

    if (open) {
      fetchProfile();
    }
  }, [user, open, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF file.',
          variant: 'destructive',
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload a file smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }
      setResumeFile(file);
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!user) return;

    setSubmitting(true);

    try {
      let resumeUrl = profile?.primary_resume_url || '';

      // Upload resume if provided
      if (resumeFile) {
        setUploading(true);
        const fileName = `${user.id}/${Date.now()}-${resumeFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, resumeFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('resumes')
          .getPublicUrl(fileName);

        resumeUrl = urlData.publicUrl;
        setUploading(false);
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

      toast({
        title: 'Application Submitted!',
        description: `Your application for ${job.title} has been submitted successfully.`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit application.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Apply for {job.title}</DialogTitle>
          <DialogDescription>
            Complete the form below to submit your application.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Personal Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input value={profile?.full_name || ''} disabled className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input value={profile?.email || user?.email || ''} disabled className="mt-1" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 9876543210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality</FormLabel>
                        <FormControl>
                          <Input placeholder="Indian" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Your current address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Academic Details */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Academic Details
                </h3>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="class_x_school"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Class X School</FormLabel>
                        <FormControl>
                          <Input placeholder="School name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="class_x_percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Percentage</FormLabel>
                        <FormControl>
                          <Input placeholder="95" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="class_xii_school"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Class XII School</FormLabel>
                        <FormControl>
                          <Input placeholder="School name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="class_xii_percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Percentage</FormLabel>
                        <FormControl>
                          <Input placeholder="95" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="degree_institution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree Institution</FormLabel>
                        <FormControl>
                          <Input placeholder="IIT Delhi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="degree_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree Name</FormLabel>
                        <FormControl>
                          <Input placeholder="B.Tech Computer Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="degree_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Graduation Year</FormLabel>
                        <FormControl>
                          <Input placeholder="2024" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="degree_cgpa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CGPA</FormLabel>
                        <FormControl>
                          <Input placeholder="8.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Professional Details */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Professional Details
                </h3>

                <FormField
                  control={form.control}
                  name="current_company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Company (if applicable)</FormLabel>
                      <FormControl>
                        <Input placeholder="Company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="current_ctc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current CTC (LPA)</FormLabel>
                        <FormControl>
                          <Input placeholder="12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expected_ctc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected CTC (LPA)</FormLabel>
                        <FormControl>
                          <Input placeholder="18" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Resume Upload */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                  Resume
                </h3>

                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  {resumeFile ? (
                    <div className="flex items-center justify-center gap-2 text-success">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm">{resumeFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload your resume (PDF only, max 5MB)
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload">
                    <Button type="button" variant="outline" size="sm" asChild>
                      <span>{resumeFile ? 'Change File' : 'Choose File'}</span>
                    </Button>
                  </label>
                </div>
              </div>

              {/* Save to Profile */}
              <FormField
                control={form.control}
                name="save_to_profile"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0 text-sm font-normal">
                      Save these details to my profile for future applications
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || uploading}
                  className="flex-1 bg-gold hover:bg-gold-light text-accent-foreground"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
