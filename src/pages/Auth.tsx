
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

// Define form schema with simplified requirements
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
      
      toast.success("Login successful");
      
      // Redirect based on user role
      const role = userData.user?.user_metadata?.role;
      console.log("[Auth] User role after login:", role);
      
      if (role === 'admin') {
        console.log("[Auth] User is an admin, redirecting to admin dashboard");
        navigate('/admin-dashboard');
      } else {
        console.log("[Auth] User role not recognized or not admin, redirecting to home page");
        navigate('/');
        toast.error("Only administrators have access.");
      }
    } catch (error: any) {
      console.error('[Auth] Login error:', error);
      toast.error("Login failed: " + (error.message || "Failed to login. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Administrator Login</CardTitle>
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
