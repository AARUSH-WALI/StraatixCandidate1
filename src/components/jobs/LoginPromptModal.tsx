import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LoginPromptModalProps {
  open: boolean;
  onClose: () => void;
  jobId: string;
}

export function LoginPromptModal({ open, onClose, jobId }: LoginPromptModalProps) {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate(`/auth?mode=login&redirect=/jobs/${jobId}`);
  };

  const handleSignup = () => {
    onClose();
    navigate(`/auth?mode=signup&redirect=/jobs/${jobId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Sign in to Apply</DialogTitle>
          <DialogDescription>
            Create an account or sign in to submit your application for this position.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Button 
            className="w-full bg-primary hover:bg-navy-medium" 
            onClick={handleLogin}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Login to Your Account
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleSignup}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Create New Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
