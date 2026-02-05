import { useEffect, useState } from 'react';
import { Upload, FileText, Trash2, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function ResumeTab() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      const { data } = await supabase
        .from('candidate_profiles')
        .select('primary_resume_url')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setResumeUrl(data.primary_resume_url);
      }
      setLoading(false);
    }

    fetchProfile();
  }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

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

    setUploading(true);

    try {
      const fileName = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      await supabase
        .from('candidate_profiles')
        .update({ primary_resume_url: urlData.publicUrl })
        .eq('user_id', user.id);

      setResumeUrl(urlData.publicUrl);

      toast({
        title: 'Resume Uploaded',
        description: 'Your resume has been saved successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Upload Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    try {
      await supabase
        .from('candidate_profiles')
        .update({ primary_resume_url: null })
        .eq('user_id', user.id);

      setResumeUrl(null);

      toast({
        title: 'Resume Removed',
        description: 'Your resume has been deleted.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to remove resume.',
        variant: 'destructive',
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
        <CardTitle className="font-display">Resume Management</CardTitle>
        <CardDescription>
          Upload and manage your resume. This will be used for all your job applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {resumeUrl ? (
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">Resume Uploaded</h3>
                <p className="text-sm text-muted-foreground">
                  Your resume is ready for applications
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-1" />
                    View
                  </a>
                </Button>
                <Button variant="outline" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                Want to replace your resume?
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleUpload}
                className="hidden"
                id="resume-replace"
                disabled={uploading}
              />
              <label htmlFor="resume-replace">
                <Button variant="outline" asChild disabled={uploading}>
                  <span>
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Resume
                      </>
                    )}
                  </span>
                </Button>
              </label>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
            <Upload className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-2">No Resume Uploaded</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Upload your resume in PDF format (max 5MB) to apply for jobs.
            </p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleUpload}
              className="hidden"
              id="resume-upload"
              disabled={uploading}
            />
            <label htmlFor="resume-upload">
              <Button asChild disabled={uploading}>
                <span>
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Resume
                    </>
                  )}
                </span>
              </Button>
            </label>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
