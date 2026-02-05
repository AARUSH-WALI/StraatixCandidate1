import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Briefcase, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import heroIllustration from '@/assets/hero-illustration.png';

export function HeroSection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold-light text-sm font-medium mb-6">
                Premium Executive Search
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Shape Your Career with{' '}
              <span className="text-gold-light">Straatix Partners</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-slate-200 mb-8 max-w-2xl"
            >
              Join a premier executive search firm that connects exceptional talent with
              transformative opportunities. We partner with leading organizations to build
              world-class leadership teams.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                onClick={() => navigate('/jobs')}
                className="bg-gold hover:bg-gold-light text-accent-foreground font-semibold px-8 group"
              >
                Explore Opportunities
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              {/* Only show Create Account button if user is NOT signed in */}
              {!user && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/auth?mode=signup')}
                  className="
                  bg-accent
                  text-accent-foreground
                  border-accent
                  hover:bg-accent/90
                  font-semibold
                  px-8
                  group
                  transition-colors
                "
                >
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-white/20"
            >
              <div className="text-center">
                <Briefcase className="h-6 w-6 text-gold mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-slate-300">Placements</div>
              </div>
              <div className="text-center">
                <Users className="h-6 w-6 text-gold mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">150+</div>
                <div className="text-sm text-slate-300">Client Partners</div>
              </div>
              <div className="text-center">
                <Target className="h-6 w-6 text-gold mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-sm text-slate-300">Success Rate</div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden lg:flex justify-center items-center"
          >
            <img
              src={heroIllustration}
              alt="Straatix Partners - Executive Search"
              className="w-full max-w-3xl xl:max-w-4xl object-contain drop-shadow-2xl scale-150 translate-x-8"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
