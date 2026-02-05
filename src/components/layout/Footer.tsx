import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Mail } from 'lucide-react';
import straatixLogo from '@/assets/straatix-logo.jpg';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <img
              src={straatixLogo}
              alt="Straatix Partners"
              className="h-10 w-auto bg-white rounded px-2 py-1"
            />
            <p className="text-sm text-primary-foreground/70">
              Premium executive search and management consulting firm connecting top talent with leading organizations.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link to="/" className="hover:text-primary-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-primary-foreground transition-colors">
                  Open Positions
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-primary-foreground transition-colors">
                  Candidate Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>About Us</li>
              <li>Our Team</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="mt-4 text-sm text-primary-foreground/70">
              info@straatixpartners.com
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Straatix Partners. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
