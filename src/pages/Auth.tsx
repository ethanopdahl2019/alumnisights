
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { signIn, signUp } from '@/services/auth';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define login form schema
const loginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

// Define registration form schema
const registerFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  role: z.enum(['applicant', 'alumni']),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type RegisterFormValues = z.infer<typeof registerFormSchema>;

const Auth = () => {
  console.log("[Auth] Component rendering");
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'applicant',
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

  // Handle registration
  const onRegisterSubmit = async (values: RegisterFormValues) => {
    console.log("[Auth] Registration submission started with email:", values.email);
    setIsLoading(true);
    try {
      const { email, password, firstName, lastName, role } = values;
      
      // Register the user
      const userData = await signUp({ 
        email, 
        password, 
        options: { 
          data: { 
            first_name: firstName,
            last_name: lastName,
            role: role 
          }
        }
      });
      
      console.log("[Auth] Registration successful for:", email, userData);
      
      toast("Registration successful! Complete your profile to get started.");
      
      // Redirect to the appropriate profile completion page based on role
      if (role === 'alumni') {
        navigate('/alumni-profile-complete');
      } else {
        navigate('/applicant-profile-complete');
      }
    } catch (error: any) {
      console.error('[Auth] Registration error:', error);
      toast("Registration failed: " + (error.message || "Failed to register. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Welcome</CardTitle>
          <CardDescription className="text-center">Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" onValueChange={(value) => setAuthMode(value as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input 
                    id="login-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    {...loginForm.register('email')} 
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-red-500 text-sm">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input 
                    id="login-password" 
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
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input 
                    id="register-email" 
                    type="email" 
                    placeholder="your@email.com" 
                    {...registerForm.register('email')} 
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-red-500 text-sm">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-first-name">First Name</Label>
                    <Input 
                      id="register-first-name" 
                      type="text" 
                      placeholder="John" 
                      {...registerForm.register('firstName')} 
                    />
                    {registerForm.formState.errors.firstName && (
                      <p className="text-red-500 text-sm">{registerForm.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-last-name">Last Name</Label>
                    <Input 
                      id="register-last-name" 
                      type="text" 
                      placeholder="Doe" 
                      {...registerForm.register('lastName')} 
                    />
                    {registerForm.formState.errors.lastName && (
                      <p className="text-red-500 text-sm">{registerForm.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input 
                    id="register-password" 
                    type="password" 
                    placeholder="••••••••" 
                    {...registerForm.register('password')} 
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-red-500 text-sm">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>I want to register as a:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={registerForm.watch('role') === 'applicant' ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => registerForm.setValue('role', 'applicant')}
                    >
                      Student Applicant
                    </Button>
                    <Button
                      type="button"
                      variant={registerForm.watch('role') === 'alumni' ? 'default' : 'outline'}
                      className="w-full"
                      onClick={() => registerForm.setValue('role', 'alumni')}
                    >
                      Alumni Mentor
                    </Button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
