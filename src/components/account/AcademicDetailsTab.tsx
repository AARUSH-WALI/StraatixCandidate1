import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const academicSchema = z.object({
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
});

type AcademicFormData = z.infer<typeof academicSchema>;

export function AcademicDetailsTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<AcademicFormData>({
    resolver: zodResolver(academicSchema),
    defaultValues: {
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
        form.reset({
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
        });
      }
      setLoading(false);
    }

    fetchProfile();
  }, [user, form]);

  const onSubmit = async (data: AcademicFormData) => {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from('candidate_profiles')
      .update({
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
      })
      .eq('user_id', user.id);

    setSaving(false);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update academic details.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Details Updated',
        description: 'Your academic details have been saved.',
      });
    }
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
        <CardTitle className="font-display">Academic & Professional Details</CardTitle>
        <CardDescription>
          Add your educational background and work experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Class X */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Class X (10th Standard)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="class_x_school"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>School Name</FormLabel>
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
                      <FormLabel>Percentage/CGPA</FormLabel>
                      <FormControl>
                        <Input placeholder="95" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Class XII */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Class XII (12th Standard)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="class_xii_school"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>School Name</FormLabel>
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
                      <FormLabel>Percentage/CGPA</FormLabel>
                      <FormControl>
                        <Input placeholder="95" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Degree */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Graduation / Degree
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="degree_institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
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

            {/* Professional */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Professional Experience
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="current_company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

            <Button type="submit" disabled={saving} className="bg-primary hover:bg-navy-medium">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
