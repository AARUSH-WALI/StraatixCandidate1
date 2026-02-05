import { motion } from 'framer-motion';
import { Award, Globe, Heart, Lightbulb } from 'lucide-react';

const values = [
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for excellence in every engagement, delivering exceptional results for our clients and candidates.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Our extensive network spans across industries and geographies, connecting talent with opportunities worldwide.',
  },
  {
    icon: Heart,
    title: 'Integrity',
    description: 'We operate with the highest ethical standards, building trust through transparency and honest communication.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We leverage cutting-edge approaches and technology to deliver efficient and effective recruitment solutions.',
  },
];

export function AboutSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium text-gold uppercase tracking-wider">
              About Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
              Your Strategic Partner in{' '}
              <span className="text-gold">Executive Talent</span>
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Straatix Partners is a premier executive search and management consulting firm
                specializing in connecting top-tier talent with leading organizations across
                diverse sectors.
              </p>
              <p>
                Founded by industry veterans, we bring decades of combined experience in
                identifying, assessing, and placing senior executives who drive business
                transformation and sustainable growth.
              </p>
              <p>
                Our rigorous methodology, combined with deep industry expertise and an
                extensive global network, enables us to deliver exceptional results for
                both our clients and candidates.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="p-6 rounded-xl bg-card border border-border/50 hover:shadow-card transition-shadow"
              >
                <value.icon className="h-8 w-8 text-gold mb-4" />
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
