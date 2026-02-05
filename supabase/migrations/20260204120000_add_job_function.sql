-- Add job_function column to jobs table for filtering by department/function
ALTER TABLE public.jobs 
ADD COLUMN job_function TEXT DEFAULT 'General' 
CHECK (job_function IN ('Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Finance', 'Operations', 'HR', 'Consulting', 'General'));

-- Update existing jobs with appropriate job functions based on title
UPDATE public.jobs SET job_function = 'Finance' WHERE title ILIKE '%Analyst%' OR title ILIKE '%Investment%' OR title ILIKE '%PE%' OR title ILIKE '%Private Equity%';
UPDATE public.jobs SET job_function = 'Consulting' WHERE title ILIKE '%Consultant%' OR title ILIKE '%Strategy%';
