import { motion } from 'framer-motion';

// Import logos
import avendusLogo from '../../assets/logos/avendus.png';
import ciscoLogo from '../../assets/logos/cisco.png';
import dealersocketLogo from '../../assets/logos/dealersocket.png';
import dialpadLogo from '../../assets/logos/dialpad.png';
import insurityLogo from '../../assets/logos/insurity.png';
import intelLogo from '../../assets/logos/intel.png';
import polycomLogo from '../../assets/logos/polycom.png';
import pwcLogo from '../../assets/logos/pwc.png';
import sapLogo from '../../assets/logos/sap.png';
import saparibaLogo from '../../assets/logos/sapariba.png';
import symphonyLogo from '../../assets/logos/symphony.png';

const clientLogos = [
  { name: 'Cisco', logo: ciscoLogo },
  { name: 'Intel', logo: intelLogo },
  { name: 'SAP', logo: sapLogo },
  { name: 'PWC', logo: pwcLogo },
  { name: 'Avendus', logo: avendusLogo },
  { name: 'DealerSocket', logo: dealersocketLogo },
  { name: 'Dialpad', logo: dialpadLogo },
  { name: 'Insurity', logo: insurityLogo },
  { name: 'Polycom', logo: polycomLogo },
  { name: 'SAP Ariba', logo: saparibaLogo },
  { name: 'Symphony', logo: symphonyLogo },
];

export function ClientSlider() {
  return (
    <section className="py-16 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2">
            Trusted by Industry Leaders
          </h2>
          <p className="text-muted-foreground">
            We've partnered with top organizations across sectors
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-secondary/30 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-secondary/30 to-transparent z-10" />

        <div className="flex animate-scroll">
          {[...clientLogos, ...clientLogos].map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className="flex-shrink-0 mx-8 group"
            >
              <div className="w-56 h-32 bg-slate-200 dark:bg-slate-800 rounded-lg border border-border/50 flex items-center justify-center transition-all duration-300 hover:shadow-card cursor-pointer p-4">
                <img
                  src={client.logo}
                  alt={`${client.name} logo`}
                  className="max-h-full max-w-full object-contain transition-transform group-hover:scale-110 duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
