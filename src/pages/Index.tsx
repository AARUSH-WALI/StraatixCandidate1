import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/landing/HeroSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { ClientSlider } from '@/components/landing/ClientSlider';
import { JobListingsSection } from '@/components/landing/JobListingsSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ClientSlider />
      <AboutSection />
      <JobListingsSection />
    </Layout>
  );
};

export default Index;
