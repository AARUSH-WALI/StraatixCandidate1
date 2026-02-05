import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Job {
  id: string;
  title: string;
  location: string;
  job_type: string;
  description: string;
}

interface JobCardProps {
  job: Job;
  index?: number;
}

export function JobCard({ job, index = 0 }: JobCardProps) {
  const getJobTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'Full-time':
        return 'default';
      case 'Internship':
        return 'secondary';
      case 'Contract':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/jobs/${job.id}`}>
        <Card className="group hover-lift cursor-pointer border-border/50 hover:border-primary/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-display text-xl font-semibold text-foreground group-hover:text-gold transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <Badge variant={getJobTypeBadgeVariant(job.job_type)} className="font-normal">
                        {job.job_type}
                      </Badge>
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {job.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
