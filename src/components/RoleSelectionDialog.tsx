
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Role = 'applicant' | 'alumni';

interface RoleSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const RoleSelectionDialog = ({ isOpen, onClose }: RoleSelectionDialogProps) => {
  const [selectedRole, setSelectedRole] = React.useState<Role>('applicant');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Update profile with selected role
      const { error } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Handle navigation based on role
      if (selectedRole === 'alumni') {
        navigate('/profile-complete');
      } else {
        if (selectedRole === 'applicant') {
          navigate('/applicant-profile-complete');
        } else {
          navigate('/');
        }
      }
      
      toast(`You've been registered as ${selectedRole === 'alumni' ? 'a student/alumni' : 'an applicant'}`);
      onClose();
    } catch (error: any) {
      console.error('[RoleSelectionDialog] Error updating role:', error);
      toast("Failed to update your role. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {
      // Don't allow closing by clicking outside
      // onClose is only called when a role is successfully selected
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome! Select your role</DialogTitle>
          <DialogDescription>
            Please select the role that best describes you. This will help us personalize your experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          <RadioGroup value={selectedRole} onValueChange={(value) => setSelectedRole(value as Role)} className="space-y-4">
            <div className="flex items-center space-x-2 border rounded-md p-4">
              <RadioGroupItem value="applicant" id="applicant" />
              <Label htmlFor="applicant" className="flex-grow cursor-pointer">
                <span className="font-medium">Applicant</span>
                <p className="text-sm text-gray-500">
                  I'm interested in applying to universities and connecting with students/alumni
                </p>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 border rounded-md p-4">
              <RadioGroupItem value="alumni" id="alumni" />
              <Label htmlFor="alumni" className="flex-grow cursor-pointer">
                <span className="font-medium">Student / Alumni</span>
                <p className="text-sm text-gray-500">
                  I'm a current student or alumni who wants to share my experience with applicants
                </p>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleSelectionDialog;
