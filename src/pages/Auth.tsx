
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { signIn } from '@/services/auth';

// Define login form schema
const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const Auth = () => {
  console.log("[Auth] Component rendering");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle login
  const onLoginSubmit = async (values: LoginFormValues) => {
    console.log("[Auth] Login submission started with email:", values.email);
    setIsLoading(true);
    try {
      const { email, password } = values;
      const userData = await signIn({ email, password });
      console.log("[Auth] Login successful for:", email, userData);
      
      toast("Login successful");
      
      // Check if user has a role, if not redirect to role selection
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userData.user.id)
        .single();
      
      if (!profile?.role) {
        navigate('/role-selection');
      } else if (profile.role === 'alumni') {
        navigate('/mentor-dashboard');
      } else if (profile.role === 'applicant') {
        navigate('/applicant-dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error('[Auth] Login error:', error);
      toast("Login failed: " + (error.message || "Failed to login. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                {...loginForm.register('email')} 
              />
              {loginForm.formState.errors.email && (
                <p className="text-red-500 text-sm">{loginForm.formState.errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                {...loginForm.register('password')} 
              />
              {loginForm.formState.errors.password && (
                <p className="text-red-500 text-sm">{loginForm.formState.errors.password.message}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
