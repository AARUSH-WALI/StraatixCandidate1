-- Create jobs table (public, managed by admin)
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('Full-time', 'Part-time', 'Contract', 'Internship', 'Remote')),
  description TEXT NOT NULL,
  responsibilities TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on jobs (public read, no public write)
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs are publicly viewable"
ON public.jobs
FOR SELECT
USING (is_active = true);

-- Create candidate_profiles table
CREATE TABLE public.candidate_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  nationality TEXT,
  gender TEXT,
  address TEXT,
  profile_image_url TEXT,
  -- Academic details
  class_x_school TEXT,
  class_x_year INTEGER,
  class_x_percentage DECIMAL,
  class_xii_school TEXT,
  class_xii_year INTEGER,
  class_xii_percentage DECIMAL,
  degree_institution TEXT,
  degree_name TEXT,
  degree_year INTEGER,
  degree_cgpa DECIMAL,
  -- Professional details
  current_company TEXT,
  current_ctc DECIMAL,
  expected_ctc DECIMAL,
  -- Resume
  primary_resume_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on candidate_profiles
ALTER TABLE public.candidate_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON public.candidate_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own profile"
ON public.candidate_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON public.candidate_profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Applied' CHECK (status IN ('Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Hired')),
  -- Snapshot of application data at time of submission
  snapshot_name TEXT NOT NULL,
  snapshot_email TEXT NOT NULL,
  snapshot_phone TEXT,
  snapshot_date_of_birth DATE,
  snapshot_nationality TEXT,
  snapshot_gender TEXT,
  snapshot_address TEXT,
  snapshot_class_x_school TEXT,
  snapshot_class_x_year INTEGER,
  snapshot_class_x_percentage DECIMAL,
  snapshot_class_xii_school TEXT,
  snapshot_class_xii_year INTEGER,
  snapshot_class_xii_percentage DECIMAL,
  snapshot_degree_institution TEXT,
  snapshot_degree_name TEXT,
  snapshot_degree_year INTEGER,
  snapshot_degree_cgpa DECIMAL,
  snapshot_current_company TEXT,
  snapshot_current_ctc DECIMAL,
  snapshot_expected_ctc DECIMAL,
  snapshot_resume_url TEXT,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- Enable RLS on applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
ON public.applications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own applications"
ON public.applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.candidate_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true);

-- Storage policies for resumes (private, user can only access own)
CREATE POLICY "Users can upload own resumes"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own resumes"
ON storage.objects
FOR SELECT
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own resumes"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own resumes"
ON storage.objects
FOR DELETE
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for profile images (public read, owner write)
CREATE POLICY "Profile images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload own profile image"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own profile image"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Insert sample jobs
INSERT INTO public.jobs (title, location, job_type, description, responsibilities, requirements) VALUES
('Senior Investment Analyst', 'Mumbai, India', 'Full-time', 'Join our team as a Senior Investment Analyst to drive strategic investment decisions and portfolio management for our high-net-worth clients.', 
  ARRAY['Conduct in-depth financial analysis and due diligence', 'Develop investment recommendations and presentations', 'Monitor portfolio performance and market trends', 'Collaborate with senior partners on deal sourcing'],
  ARRAY['MBA/CFA preferred', '5+ years in investment banking or private equity', 'Strong financial modeling skills', 'Excellent communication abilities']),
('Associate Consultant', 'Bangalore, India', 'Full-time', 'We are looking for a motivated Associate Consultant to support our management consulting practice across various industries.',
  ARRAY['Support project teams in research and analysis', 'Prepare client presentations and reports', 'Conduct market research and competitive analysis', 'Assist in developing strategic recommendations'],
  ARRAY['MBA from a premier institution', '2-4 years of consulting experience', 'Strong analytical and problem-solving skills', 'Proficiency in Excel and PowerPoint']),
('Summer Internship - Strategy', 'Delhi NCR, India', 'Internship', 'A 10-week intensive internship program designed for MBA students interested in strategy consulting.',
  ARRAY['Work on live client projects', 'Conduct primary and secondary research', 'Support senior consultants in analysis', 'Present findings to internal teams'],
  ARRAY['Current MBA student from Tier-1 B-school', 'Strong academic record', 'Excellent analytical skills', 'Interest in strategy consulting']),
('Private Equity Associate', 'Mumbai, India', 'Full-time', 'Seeking a driven PE Associate to join our growing private equity practice focusing on mid-market investments.',
  ARRAY['Execute end-to-end deal transactions', 'Build financial models and valuations', 'Conduct due diligence on target companies', 'Support portfolio company monitoring'],
  ARRAY['CA/CFA with 3-5 years PE/IB experience', 'Strong transaction experience', 'Advanced Excel and modeling skills', 'Deal-making mindset']);